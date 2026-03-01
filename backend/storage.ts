import {
  lessonDays, generationJobs, uploadedDocuments, users, blogPosts, siteSettings, brandingSettings,
  type LessonDay, type InsertLessonDay, type GenerationJob, type UploadedDocument,
  type User, type InsertUser, type BlogPost, type InsertBlogPost, type SiteSetting,
  type BrandingSettings, type InsertBrandingSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, count, sql, desc, and } from "drizzle-orm";

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

  // Users
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<void>;
  deleteUser(id: number): Promise<void>;

  // Blog
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<BlogPost>): Promise<void>;
  deleteBlogPost(id: number): Promise<void>;

  // Site Settings
  getSetting(key: string): Promise<string | undefined>;
  getAllSettings(): Promise<SiteSetting[]>;
  upsertSetting(key: string, value: string): Promise<void>;

  // Branding
  getBrandingSettings(userId?: number): Promise<BrandingSettings | undefined>;
  saveBrandingSettings(data: InsertBrandingSettings): Promise<BrandingSettings>;
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

  // Users
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async updateUser(id: number, data: Partial<User>): Promise<void> {
    await db.update(users).set(data).where(eq(users.id, id));
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Blog
  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<void> {
    await db.update(blogPosts).set({ ...data, updatedAt: new Date() }).where(eq(blogPosts.id, id));
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Site Settings
  async getSetting(key: string): Promise<string | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting?.value;
  }

  async getAllSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async upsertSetting(key: string, value: string): Promise<void> {
    await db.insert(siteSettings).values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() },
      });
  }

  async getBrandingSettings(userId?: number): Promise<BrandingSettings | undefined> {
    if (userId) {
      const [result] = await db.select().from(brandingSettings).where(eq(brandingSettings.userId, userId));
      return result;
    }
    const [result] = await db.select().from(brandingSettings).limit(1);
    return result;
  }

  async saveBrandingSettings(data: InsertBrandingSettings): Promise<BrandingSettings> {
    const existing = data.userId ? await this.getBrandingSettings(data.userId) : await this.getBrandingSettings();
    if (existing) {
      const [updated] = await db.update(brandingSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(brandingSettings.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(brandingSettings).values({ ...data, updatedAt: new Date() }).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
