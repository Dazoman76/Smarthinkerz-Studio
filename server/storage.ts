import { lessonDays, generationJobs, uploadedDocuments, type LessonDay, type InsertLessonDay, type GenerationJob, type UploadedDocument } from "@shared/schema";
import { db } from "./db";
import { eq, count, sql } from "drizzle-orm";

export interface IStorage {
  getAllLessonDays(): Promise<LessonDay[]>;
  getLessonDay(id: number): Promise<LessonDay | undefined>;
  upsertLessonDay(day: InsertLessonDay): Promise<LessonDay>;
  clearAllLessonDays(): Promise<void>;
  insertLessonDays(days: InsertLessonDay[]): Promise<void>;
  updateLessonDayImageStatus(id: number, status: string, path?: string, error?: string): Promise<void>;
  updateLessonDayVideoStatus(id: number, status: string, path?: string, error?: string): Promise<void>;
  getStats(): Promise<{
    totalDays: number;
    imagesCompleted: number;
    videosCompleted: number;
    imagesFailed: number;
    videosFailed: number;
    imagesGenerating: number;
    videosGenerating: number;
    imagesPending: number;
    videosPending: number;
  }>;
  getActiveJob(): Promise<GenerationJob | undefined>;
  createJob(totalImages: number, totalVideos: number): Promise<GenerationJob>;
  updateJob(id: string, data: Partial<GenerationJob>): Promise<void>;
  createUploadedDocument(filename: string, content: string): Promise<UploadedDocument>;
  updateUploadedDocument(id: number, data: Partial<UploadedDocument>): Promise<void>;
  getUploadedDocuments(): Promise<UploadedDocument[]>;
}

export class DatabaseStorage implements IStorage {
  async getAllLessonDays(): Promise<LessonDay[]> {
    return await db.select().from(lessonDays).orderBy(lessonDays.id);
  }

  async getLessonDay(id: number): Promise<LessonDay | undefined> {
    const [day] = await db.select().from(lessonDays).where(eq(lessonDays.id, id));
    return day;
  }

  async upsertLessonDay(day: InsertLessonDay): Promise<LessonDay> {
    const [result] = await db
      .insert(lessonDays)
      .values(day)
      .onConflictDoUpdate({
        target: lessonDays.id,
        set: { topic: day.topic, description: day.description },
      })
      .returning();
    return result;
  }

  async clearAllLessonDays(): Promise<void> {
    await db.delete(lessonDays);
  }

  async insertLessonDays(days: InsertLessonDay[]): Promise<void> {
    if (days.length === 0) return;
    for (let i = 0; i < days.length; i += 50) {
      const batch = days.slice(i, i + 50);
      await db.insert(lessonDays).values(batch).onConflictDoUpdate({
        target: lessonDays.id,
        set: {
          topic: sql`excluded.topic`,
          description: sql`excluded.description`,
          imageStatus: sql`'pending'`,
          videoStatus: sql`'pending'`,
          imagePath: sql`NULL`,
          videoPath: sql`NULL`,
          imageError: sql`NULL`,
          videoError: sql`NULL`,
        },
      });
    }
  }

  async updateLessonDayImageStatus(id: number, status: string, path?: string, error?: string): Promise<void> {
    const updateData: any = { imageStatus: status };
    if (path) updateData.imagePath = path;
    if (error) updateData.imageError = error;
    if (status === "completed") updateData.imageGeneratedAt = new Date();
    await db.update(lessonDays).set(updateData).where(eq(lessonDays.id, id));
  }

  async updateLessonDayVideoStatus(id: number, status: string, path?: string, error?: string): Promise<void> {
    const updateData: any = { videoStatus: status };
    if (path) updateData.videoPath = path;
    if (error) updateData.videoError = error;
    if (status === "completed") updateData.videoGeneratedAt = new Date();
    await db.update(lessonDays).set(updateData).where(eq(lessonDays.id, id));
  }

  async getStats() {
    const days = await this.getAllLessonDays();
    return {
      totalDays: days.length,
      imagesCompleted: days.filter(d => d.imageStatus === "completed").length,
      videosCompleted: days.filter(d => d.videoStatus === "completed").length,
      imagesFailed: days.filter(d => d.imageStatus === "failed").length,
      videosFailed: days.filter(d => d.videoStatus === "failed").length,
      imagesGenerating: days.filter(d => d.imageStatus === "generating").length,
      videosGenerating: days.filter(d => d.videoStatus === "generating").length,
      imagesPending: days.filter(d => d.imageStatus === "pending").length,
      videosPending: days.filter(d => d.videoStatus === "pending").length,
    };
  }

  async getActiveJob(): Promise<GenerationJob | undefined> {
    const [job] = await db
      .select()
      .from(generationJobs)
      .where(eq(generationJobs.status, "running"))
      .orderBy(generationJobs.startedAt);
    return job;
  }

  async createJob(totalImages: number, totalVideos: number): Promise<GenerationJob> {
    const [job] = await db
      .insert(generationJobs)
      .values({
        status: "running",
        totalImages,
        totalVideos,
        startedAt: new Date(),
      })
      .returning();
    return job;
  }

  async updateJob(id: string, data: Partial<GenerationJob>): Promise<void> {
    await db.update(generationJobs).set(data).where(eq(generationJobs.id, id));
  }

  async createUploadedDocument(filename: string, content: string): Promise<UploadedDocument> {
    const [doc] = await db
      .insert(uploadedDocuments)
      .values({ filename, originalContent: content, status: "processing" })
      .returning();
    return doc;
  }

  async updateUploadedDocument(id: number, data: Partial<UploadedDocument>): Promise<void> {
    await db.update(uploadedDocuments).set(data).where(eq(uploadedDocuments.id, id));
  }

  async getUploadedDocuments(): Promise<UploadedDocument[]> {
    return await db.select().from(uploadedDocuments).orderBy(uploadedDocuments.uploadedAt);
  }
}

export const storage = new DatabaseStorage();
