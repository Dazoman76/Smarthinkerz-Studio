import { storage } from "./storage";
import type { LessonDay } from "@shared/schema";
import { generateImageBuffer } from "./replit_integrations/image/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

export type MediaStyle = "photorealistic" | "illustration" | "cartoon" | "3d-render" | "watercolor" | "minimalist" | "cinematic";

const stylePrompts: Record<MediaStyle, string> = {
  "photorealistic": "Photorealistic photograph, shot on a Canon EOS R5 with a 50mm f/1.4 lens, natural ambient lighting, shallow depth of field, ultra-realistic textures, real-world materials, no illustration or cartoon elements, professional DSLR photography, RAW quality, lifelike",
  "illustration": "Professional digital illustration, detailed artwork, modern design, clean lines, vibrant colors, editorial illustration style",
  "cartoon": "Colorful cartoon style, fun and playful, bold outlines, bright saturated colors, animated look, comic book aesthetic",
  "3d-render": "3D rendered scene, realistic materials and textures, studio lighting, polished 3D visualization, Cinema 4D quality",
  "watercolor": "Beautiful watercolor painting style, soft brushstrokes, flowing colors, artistic and elegant, paper texture visible",
  "minimalist": "Clean minimalist design, simple shapes, limited color palette, modern and sleek, generous white space, flat design",
  "cinematic": "Cinematic film still, dramatic lighting, wide-angle anamorphic lens, movie-quality composition, atmospheric, color graded",
};

class GenerationEngine {
  private running = false;
  private paused = false;
  private currentJobId: string | null = null;
  private pauseResolve: (() => void) | null = null;
  private imageStyle: MediaStyle = "photorealistic";
  private videoStyle: MediaStyle = "photorealistic";

  isRunning(): boolean {
    return this.running;
  }

  isPaused(): boolean {
    return this.paused;
  }

  getStatus(): "idle" | "running" | "paused" {
    if (!this.running) return "idle";
    if (this.paused) return "paused";
    return "running";
  }

  getStyles(): { imageStyle: MediaStyle; videoStyle: MediaStyle } {
    return { imageStyle: this.imageStyle, videoStyle: this.videoStyle };
  }

  setStyles(imageStyle?: MediaStyle, videoStyle?: MediaStyle): void {
    if (imageStyle) this.imageStyle = imageStyle;
    if (videoStyle) this.videoStyle = videoStyle;
  }

  async start(options?: { imageStyle?: MediaStyle; videoStyle?: MediaStyle }): Promise<void> {
    if (this.running && !this.paused) return;

    if (this.paused) {
      this.resume();
      return;
    }

    if (options?.imageStyle) this.imageStyle = options.imageStyle;
    if (options?.videoStyle) this.videoStyle = options.videoStyle;

    this.running = true;
    this.paused = false;

    const generatedDir = path.join(process.cwd(), "generated");
    const imagesDir = path.join(generatedDir, "images");
    const videosDir = path.join(generatedDir, "videos");

    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
    if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

    const stats = await storage.getStats();
    const job = await storage.createJob(
      stats.totalDays - stats.imagesCompleted,
      stats.totalDays - stats.videosCompleted
    );
    this.currentJobId = job.id;

    this.runGenerationLoop().catch((err) => {
      console.error("Generation loop error:", err);
      this.running = false;
      this.paused = false;
    });
  }

  pause(): void {
    if (this.running && !this.paused) {
      this.paused = true;
      console.log("Generation paused - will pause after current item completes");
      if (this.currentJobId) {
        storage.updateJob(this.currentJobId, { status: "paused" });
      }
    }
  }

  resume(): void {
    if (this.running && this.paused) {
      this.paused = false;
      console.log("Generation resumed");
      if (this.currentJobId) {
        storage.updateJob(this.currentJobId, { status: "running" });
      }
      if (this.pauseResolve) {
        this.pauseResolve();
        this.pauseResolve = null;
      }
    }
  }

  stop(): void {
    this.running = false;
    this.paused = false;
    if (this.pauseResolve) {
      this.pauseResolve();
      this.pauseResolve = null;
    }
    if (this.currentJobId) {
      storage.updateJob(this.currentJobId, {
        status: "stopped",
        completedAt: new Date(),
      });
      this.currentJobId = null;
    }
    console.log("Generation stopped");
  }

  private async waitIfPaused(): Promise<void> {
    if (this.paused && this.running) {
      console.log("Generation paused - waiting for resume...");
      await new Promise<void>((resolve) => {
        this.pauseResolve = resolve;
      });
    }
  }

  private async runGenerationLoop(): Promise<void> {
    const days = await storage.getAllLessonDays();

    for (const day of days) {
      if (!this.running) break;
      await this.waitIfPaused();
      if (!this.running) break;

      if (day.imageStatus === "pending") {
        await this.generateImage(day);
      }

      const updatedDay = await storage.getLessonDay(day.id);
      if (updatedDay && updatedDay.imageStatus === "completed" && updatedDay.videoStatus === "pending") {
        await this.generateVideo(updatedDay);
      }

      if (this.currentJobId) {
        const stats = await storage.getStats();
        await storage.updateJob(this.currentJobId, {
          completedImages: stats.imagesCompleted,
          completedVideos: stats.videosCompleted,
          failedImages: stats.imagesFailed,
          failedVideos: stats.videosFailed,
          currentDay: day.id,
        });
      }
    }

    const remainingDays = await storage.getAllLessonDays();
    for (const day of remainingDays) {
      if (!this.running) break;
      await this.waitIfPaused();
      if (!this.running) break;

      if (day.videoStatus === "pending" && day.imageStatus === "completed") {
        await this.generateVideo(day);

        if (this.currentJobId) {
          const stats = await storage.getStats();
          await storage.updateJob(this.currentJobId, {
            completedImages: stats.imagesCompleted,
            completedVideos: stats.videosCompleted,
            failedImages: stats.imagesFailed,
            failedVideos: stats.videosFailed,
            currentDay: day.id,
          });
        }
      }
    }

    if (this.currentJobId) {
      await storage.updateJob(this.currentJobId, {
        status: "completed",
        completedAt: new Date(),
      });
    }
    this.running = false;
    this.currentJobId = null;
  }

  private async generateImage(day: LessonDay): Promise<void> {
    try {
      await storage.updateLessonDayImageStatus(day.id, "generating");

      const styleDesc = stylePrompts[this.imageStyle] || stylePrompts["photorealistic"];
      const prompt = `${styleDesc}. Educational image for "Day ${day.id}: ${day.topic}". ${day.description}. The label "Day ${day.id}" must be prominently displayed. High quality, clean composition. 16:9 widescreen.`;

      let imageBuffer: Buffer | null = null;
      const maxRetries = 3;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          imageBuffer = await generateImageBuffer(prompt, "1536x1024");
          break;
        } catch (err: any) {
          if (attempt < maxRetries && (err.status === 429 || err.status === 500 || err.status === 503)) {
            const waitTime = attempt * 10000;
            console.log(`Image gen rate limited for Day ${day.id}, waiting ${waitTime / 1000}s (attempt ${attempt})...`);
            await new Promise(r => setTimeout(r, waitTime));
          } else {
            throw err;
          }
        }
      }

      if (!imageBuffer) throw new Error("Failed to generate image after retries");

      const outputPath = path.join(process.cwd(), "generated", "images", `day_${day.id}.png`);
      fs.writeFileSync(outputPath, imageBuffer);

      await storage.updateLessonDayImageStatus(
        day.id,
        "completed",
        `/generated/images/day_${day.id}.png`
      );
      console.log(`Image generated for Day ${day.id}: ${day.topic}`);

      await new Promise(r => setTimeout(r, 1000));
    } catch (error: any) {
      console.error(`Image generation failed for Day ${day.id}:`, error.message);
      await storage.updateLessonDayImageStatus(
        day.id,
        "failed",
        undefined,
        error.message
      );
    }
  }

  private async generateVideo(day: LessonDay): Promise<void> {
    try {
      await storage.updateLessonDayVideoStatus(day.id, "generating");

      const imagePath = path.join(process.cwd(), "generated", "images", `day_${day.id}.png`);
      const videoPath = path.join(process.cwd(), "generated", "videos", `day_${day.id}.mp4`);

      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image for Day ${day.id} not found. Generate images first.`);
      }

      await this.createVideoFromImage(imagePath, videoPath, `Day ${day.id}`, day.topic, day.id);

      await storage.updateLessonDayVideoStatus(
        day.id,
        "completed",
        `/generated/videos/day_${day.id}.mp4`
      );
      console.log(`Video generated for Day ${day.id}: ${day.topic}`);
    } catch (error: any) {
      console.error(`Video generation failed for Day ${day.id}:`, error.message);
      await storage.updateLessonDayVideoStatus(
        day.id,
        "failed",
        undefined,
        error.message
      );
    }
  }

  private getMotionPreset(dayId: number): { zoompan: string; name: string } {
    const presets = [
      {
        name: "sweep-left-to-right",
        zoompan: "zoompan=z='1.3':x='(iw*0.3)*(1-on/180)':y='ih/2-(ih/zoom/2)':d=180:s=1536x1024:fps=30",
      },
      {
        name: "sweep-right-to-left",
        zoompan: "zoompan=z='1.3':x='iw*0.7*on/180':y='ih/2-(ih/zoom/2)':d=180:s=1536x1024:fps=30",
      },
      {
        name: "zoom-in-top-left",
        zoompan: "zoompan=z='min(zoom+0.002,1.5)':x='iw*0.2':y='ih*0.2':d=180:s=1536x1024:fps=30",
      },
      {
        name: "zoom-out-reveal",
        zoompan: "zoompan=z='if(eq(on,1),1.6,max(zoom-0.004,1.0))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=180:s=1536x1024:fps=30",
      },
      {
        name: "diagonal-drift-down",
        zoompan: "zoompan=z='min(zoom+0.0012,1.25)':x='iw*0.15+iw*0.15*(on/180)':y='ih*0.1+ih*0.15*(on/180)':d=180:s=1536x1024:fps=30",
      },
      {
        name: "diagonal-drift-up",
        zoompan: "zoompan=z='min(zoom+0.0012,1.25)':x='iw*0.3-iw*0.15*(on/180)':y='ih*0.35-ih*0.15*(on/180)':d=180:s=1536x1024:fps=30",
      },
      {
        name: "pan-up-zoom",
        zoompan: "zoompan=z='min(zoom+0.0018,1.35)':x='iw/2-(iw/zoom/2)':y='ih*0.4-ih*0.25*(on/180)':d=180:s=1536x1024:fps=30",
      },
      {
        name: "pan-down-zoom",
        zoompan: "zoompan=z='min(zoom+0.0018,1.35)':x='iw/2-(iw/zoom/2)':y='ih*0.05+ih*0.25*(on/180)':d=180:s=1536x1024:fps=30",
      },
      {
        name: "zoom-in-center-fast",
        zoompan: "zoompan=z='min(zoom+0.003,1.6)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=180:s=1536x1024:fps=30",
      },
      {
        name: "sweep-bottom-right",
        zoompan: "zoompan=z='min(zoom+0.0015,1.3)':x='iw*0.1+iw*0.25*(on/180)':y='ih*0.1+ih*0.2*(on/180)':d=180:s=1536x1024:fps=30",
      },
    ];

    return presets[dayId % presets.length];
  }

  private createVideoFromImage(
    imagePath: string,
    outputPath: string,
    dayLabel: string,
    topic: string,
    dayId: number = 0
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const escapedDay = dayLabel.replace(/'/g, "'\\''");
      const escapedTopic = topic.replace(/'/g, "'\\''").substring(0, 60);
      const motion = this.getMotionPreset(dayId);

      const dayText = `drawtext=text='${escapedDay}':fontsize=72:fontcolor=white:borderw=3:bordercolor=black:x='if(lt(t,0.5),-text_w,if(lt(t,1.2),(-text_w)+((w/2-text_w/2)+text_w)*((t-0.5)/0.7),(w-text_w)/2))':y=h*0.08`;
      const topicText = `drawtext=text='${escapedTopic}':fontsize=36:fontcolor=white:borderw=2:bordercolor=black:x='if(lt(t,1.2),w+text_w,if(lt(t,2.0),(w+text_w)-((w+text_w)-(w-text_w)/2)*((t-1.2)/0.8),(w-text_w)/2))':y=h*0.88`;
      const fadeIn = `fade=t=in:st=0:d=0.8`;
      const fadeOut = `fade=t=out:st=5.2:d=0.8`;

      const vf = `scale=1536:1024,${motion.zoompan},${fadeIn},${fadeOut},${dayText},${topicText}`;

      const cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", `"${imagePath}"`,
        "-t", "6",
        "-vf", `"${vf}"`,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "23",
        `"${outputPath}"`
      ].join(" ");

      console.log(`Video motion: ${motion.name} for ${dayLabel}`);
      exec(cmd, { timeout: 90000 }, (error, _stdout, stderr) => {
        if (error) {
          reject(new Error(`ffmpeg error: ${stderr || error.message}`));
        } else {
          resolve();
        }
      });
    });
  }
}

export const generationEngine = new GenerationEngine();
