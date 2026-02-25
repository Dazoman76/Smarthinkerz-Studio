import { storage } from "./storage";
import type { LessonDay } from "@shared/schema";
import { generateImageBuffer } from "./replit_integrations/image/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

class GenerationEngine {
  private running = false;
  private currentJobId: string | null = null;

  isRunning(): boolean {
    return this.running;
  }

  setRunning(value: boolean): void {
    this.running = value;
  }

  async start(): Promise<void> {
    if (this.running) return;
    this.running = true;

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
    });
  }

  stop(): void {
    this.running = false;
    if (this.currentJobId) {
      storage.updateJob(this.currentJobId, {
        status: "stopped",
        completedAt: new Date(),
      });
      this.currentJobId = null;
    }
  }

  private async runGenerationLoop(): Promise<void> {
    const days = await storage.getAllLessonDays();

    for (const day of days) {
      if (!this.running) break;

      if (day.imageStatus === "pending") {
        await this.generateImage(day);
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

    const updatedDays = await storage.getAllLessonDays();
    for (const day of updatedDays) {
      if (!this.running) break;

      if (day.videoStatus === "pending" && day.imageStatus === "completed") {
        await this.generateVideo(day);
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

      const prompt = `Professional educational illustration for "Day ${day.id}: ${day.topic}". ${day.description}. The label "Day ${day.id}" must be prominently displayed. High quality, detailed, photorealistic, modern educational design, vibrant colors, clean composition. 16:9 widescreen.`;

      const imageBuffer = await generateImageBuffer(prompt, "1536x1024");

      const outputPath = path.join(process.cwd(), "generated", "images", `day_${day.id}.png`);
      fs.writeFileSync(outputPath, imageBuffer);

      await storage.updateLessonDayImageStatus(
        day.id,
        "completed",
        `/generated/images/day_${day.id}.png`
      );
      console.log(`Image generated for Day ${day.id}: ${day.topic}`);
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

      await this.createVideoFromImage(imagePath, videoPath, `Day ${day.id}`, day.topic);

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

  private createVideoFromImage(
    imagePath: string,
    outputPath: string,
    dayLabel: string,
    topic: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const escapedDay = dayLabel.replace(/'/g, "'\\''");
      const escapedTopic = topic.replace(/'/g, "'\\''").substring(0, 60);

      const cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", `"${imagePath}"`,
        "-t", "6",
        "-vf", `"scale=1536:1024,zoompan=z='min(zoom+0.0015,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=180:s=1536x1024:fps=30,drawtext=text='${escapedDay}':fontsize=72:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=h*0.08:enable='gte(t,0.5)',drawtext=text='${escapedTopic}':fontsize=36:fontcolor=white:borderw=2:bordercolor=black:x=(w-text_w)/2:y=h*0.88:enable='gte(t,1)'"`,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "23",
        `"${outputPath}"`
      ].join(" ");

      exec(cmd, { timeout: 60000 }, (error, _stdout, stderr) => {
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
