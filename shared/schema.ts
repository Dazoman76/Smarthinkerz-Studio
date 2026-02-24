import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, pgEnum, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const mediaStatusEnum = pgEnum("media_status", [
  "pending",
  "generating",
  "completed",
  "failed",
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

export const insertLessonDaySchema = createInsertSchema(lessonDays);
export const insertGenerationJobSchema = createInsertSchema(generationJobs).omit({ id: true });
export const insertUploadedDocumentSchema = createInsertSchema(uploadedDocuments).omit({ id: true, uploadedAt: true });

export type LessonDay = typeof lessonDays.$inferSelect;
export type InsertLessonDay = z.infer<typeof insertLessonDaySchema>;
export type GenerationJob = typeof generationJobs.$inferSelect;
export type InsertGenerationJob = z.infer<typeof insertGenerationJobSchema>;
export type UploadedDocument = typeof uploadedDocuments.$inferSelect;
export type InsertUploadedDocument = z.infer<typeof insertUploadedDocumentSchema>;
