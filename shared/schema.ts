import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, pgEnum, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const mediaStatusEnum = pgEnum("media_status", [
  "pending",
  "generating",
  "completed",
  "failed",
]);

export const userRoleEnum = pgEnum("user_role", [
  "viewer",
  "writer",
  "editor",
  "administrator",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "blocked",
]);

export const blogStatusEnum = pgEnum("blog_status", [
  "draft",
  "published",
]);

export const lessonDays = pgTable("lesson_days", {
  id: integer("id").primaryKey(),
  topic: text("topic").notNull(),
  description: text("description").notNull(),
  imageStatus: mediaStatusEnum("image_status").default("pending").notNull(),
  videoStatus: mediaStatusEnum("video_status").default("pending").notNull(),
  imagePath: text("image_path"),
  videoPath: text("video_path"),
  imageError: text("image_error"),
  videoError: text("video_error"),
  imageGeneratedAt: timestamp("image_generated_at"),
  videoGeneratedAt: timestamp("video_generated_at"),
});

export const generationJobs = pgTable("generation_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull().default("idle"),
  totalImages: integer("total_images").notNull().default(0),
  totalVideos: integer("total_videos").notNull().default(0),
  completedImages: integer("completed_images").notNull().default(0),
  completedVideos: integer("completed_videos").notNull().default(0),
  failedImages: integer("failed_images").notNull().default(0),
  failedVideos: integer("failed_videos").notNull().default(0),
  currentDay: integer("current_day").default(0),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const uploadedDocuments = pgTable("uploaded_documents", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalContent: text("original_content").notNull(),
  parsedLessonsCount: integer("parsed_lessons_count").default(0),
  status: text("status").notNull().default("processing"),
  uploadedAt: timestamp("uploaded_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("viewer").notNull(),
  status: userStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  authorId: integer("author_id").references(() => users.id),
  status: blogStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertLessonDaySchema = createInsertSchema(lessonDays);
export const insertGenerationJobSchema = createInsertSchema(generationJobs).omit({ id: true });
export const insertUploadedDocumentSchema = createInsertSchema(uploadedDocuments).omit({ id: true, uploadedAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSiteSettingSchema = createInsertSchema(siteSettings);

export type LessonDay = typeof lessonDays.$inferSelect;
export type InsertLessonDay = z.infer<typeof insertLessonDaySchema>;
export type GenerationJob = typeof generationJobs.$inferSelect;
export type InsertGenerationJob = z.infer<typeof insertGenerationJobSchema>;
export type UploadedDocument = typeof uploadedDocuments.$inferSelect;
export type InsertUploadedDocument = z.infer<typeof insertUploadedDocumentSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
