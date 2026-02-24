import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generationEngine } from "./generation-engine";
import { parseDocumentToLessons, extractTextFromFile } from "./document-parser";
import * as path from "path";
import * as fs from "fs";
import express from "express";
import multer from "multer";

const upload = multer({
  dest: path.join(process.cwd(), "uploads"),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/csv",
      "text/markdown",
      "application/octet-stream",
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(txt|csv|md|pdf|docx)$/i)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Please upload .txt, .csv, .md, .pdf, or .docx files."));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const generatedDir = path.join(process.cwd(), "generated");
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
    fs.mkdirSync(path.join(generatedDir, "images"), { recursive: true });
    fs.mkdirSync(path.join(generatedDir, "videos"), { recursive: true });
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  app.use("/generated", express.static(generatedDir));

  app.get("/api/lesson-days", async (_req, res) => {
    const days = await storage.getAllLessonDays();
    res.json(days);
  });

  app.get("/api/lesson-days/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const day = await storage.getLessonDay(id);
    if (!day) {
      return res.status(404).json({ message: "Lesson day not found" });
    }
    res.json(day);
  });

  app.get("/api/stats", async (_req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  app.get("/api/generation/status", async (_req, res) => {
    const isRunning = generationEngine.isRunning();
    const job = await storage.getActiveJob();
    res.json({ isRunning, job });
  });

  app.post("/api/generation/start", async (_req, res) => {
    if (generationEngine.isRunning()) {
      return res.status(400).json({ message: "Generation is already running" });
    }
    const stats = await storage.getStats();
    if (stats.totalDays === 0) {
      return res.status(400).json({ message: "No lessons found. Please upload a document first." });
    }
    await generationEngine.start();
    res.json({ message: "Generation started" });
  });

  app.post("/api/generation/stop", async (_req, res) => {
    generationEngine.stop();
    res.json({ message: "Generation stopped" });
  });

  app.post("/api/generation/retry-failed", async (_req, res) => {
    const days = await storage.getAllLessonDays();
    for (const day of days) {
      if (day.imageStatus === "failed") {
        await storage.updateLessonDayImageStatus(day.id, "pending");
      }
      if (day.videoStatus === "failed") {
        await storage.updateLessonDayVideoStatus(day.id, "pending");
      }
    }
    res.json({ message: "Failed items reset to pending" });
  });

  app.post("/api/upload", upload.single("document"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath = req.file.path;
      const mimeType = req.file.mimetype;
      const filename = req.file.originalname;

      const textContent = await extractTextFromFile(filePath, mimeType);

      if (!textContent || textContent.trim().length === 0) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ message: "Could not extract text from the uploaded file." });
      }

      const doc = await storage.createUploadedDocument(filename, textContent);

      res.json({
        message: "Document uploaded and processing started",
        documentId: doc.id,
        filename,
        contentLength: textContent.length,
      });

      parseDocumentToLessons(textContent)
        .then(async (lessons) => {
          if (lessons.length > 0) {
            await storage.clearAllLessonDays();

            const lessonData = lessons.map(l => ({
              id: l.dayNumber,
              topic: l.topic,
              description: l.description,
            }));

            await storage.insertLessonDays(lessonData);
          }
          await storage.updateUploadedDocument(doc.id, {
            parsedLessonsCount: lessons.length,
            status: "completed",
          });
          console.log(`Document parsed: ${lessons.length} lessons extracted from ${filename}`);
        })
        .catch(async (error) => {
          console.error("Document parsing error:", error);
          await storage.updateUploadedDocument(doc.id, {
            status: "failed",
          });
        });

      fs.unlinkSync(filePath);
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ message: error.message || "Upload failed" });
    }
  });

  app.post("/api/uploads/:id/reparse", async (req, res) => {
    const id = parseInt(req.params.id);
    const docs = await storage.getUploadedDocuments();
    const doc = docs.find(d => d.id === id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    await storage.updateUploadedDocument(doc.id, { status: "processing", parsedLessonsCount: 0 });
    res.json({ message: "Re-parsing started" });

    parseDocumentToLessons(doc.originalContent)
      .then(async (lessons) => {
        if (lessons.length > 0) {
          await storage.clearAllLessonDays();
          const lessonData = lessons.map(l => ({
            id: l.dayNumber,
            topic: l.topic,
            description: l.description,
          }));
          await storage.insertLessonDays(lessonData);
        }
        await storage.updateUploadedDocument(doc.id, {
          parsedLessonsCount: lessons.length,
          status: "completed",
        });
        console.log(`Document re-parsed: ${lessons.length} lessons extracted`);
      })
      .catch(async (error) => {
        console.error("Document re-parsing error:", error);
        await storage.updateUploadedDocument(doc.id, { status: "failed" });
      });
  });

  app.get("/api/uploads", async (_req, res) => {
    const docs = await storage.getUploadedDocuments();
    res.json(docs);
  });

  app.get("/api/uploads/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    const docs = await storage.getUploadedDocuments();
    const doc = docs.find(d => d.id === id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(doc);
  });

  return httpServer;
}
