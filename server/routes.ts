import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generationEngine, type MediaStyle } from "./generation-engine";
import { parseDocumentToLessons, extractTextFromFile } from "./document-parser";
import { requireAuth, requireRole } from "./auth";
import * as path from "path";
import * as fs from "fs";
import express from "express";
import multer from "multer";
import archiver from "archiver";
import bcrypt from "bcrypt";

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
    const status = generationEngine.getStatus();
    const isRunning = generationEngine.isRunning();
    const isPaused = generationEngine.isPaused();
    const styles = generationEngine.getStyles();
    const job = await storage.getActiveJob();
    res.json({ isRunning, isPaused, status, ...styles, job });
  });

  app.post("/api/generation/start", async (req, res) => {
    if (generationEngine.isRunning() && !generationEngine.isPaused()) {
      return res.status(400).json({ message: "Generation is already running" });
    }
    const stats = await storage.getStats();
    if (stats.totalDays === 0) {
      return res.status(400).json({ message: "No lessons found. Please upload a document first." });
    }
    const { imageStyle, videoStyle } = req.body || {};
    await generationEngine.start({ imageStyle, videoStyle });
    res.json({ message: "Generation started" });
  });

  app.post("/api/generation/pause", async (_req, res) => {
    generationEngine.pause();
    res.json({ message: "Generation paused" });
  });

  app.post("/api/generation/resume", async (_req, res) => {
    generationEngine.resume();
    res.json({ message: "Generation resumed" });
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

      const imagesDir = path.join(process.cwd(), "generated", "images");
      const videosDir = path.join(process.cwd(), "generated", "videos");
      if (fs.existsSync(imagesDir)) {
        for (const f of fs.readdirSync(imagesDir)) fs.unlinkSync(path.join(imagesDir, f));
      }
      if (fs.existsSync(videosDir)) {
        for (const f of fs.readdirSync(videosDir)) fs.unlinkSync(path.join(videosDir, f));
      }

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

  function sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9_\- ]/g, "").replace(/\s+/g, "_").substring(0, 80);
  }

  app.get("/api/download/image/:dayId", async (req, res) => {
    const dayId = parseInt(req.params.dayId);
    const imagePath = path.join(process.cwd(), "generated", "images", `day_${dayId}.png`);
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image not found" });
    }
    const days = await storage.getAllLessonDays();
    const day = days.find(d => d.id === dayId);
    const topicSlug = day ? sanitizeFilename(day.topic) : "";
    const filename = topicSlug ? `Day_${dayId}_${topicSlug}.png` : `Day_${dayId}.png`;
    res.download(imagePath, filename);
  });

  app.get("/api/download/video/:dayId", async (req, res) => {
    const dayId = parseInt(req.params.dayId);
    const videoPath = path.join(process.cwd(), "generated", "videos", `day_${dayId}.mp4`);
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: "Video not found" });
    }
    const days = await storage.getAllLessonDays();
    const day = days.find(d => d.id === dayId);
    const topicSlug = day ? sanitizeFilename(day.topic) : "";
    const filename = topicSlug ? `Day_${dayId}_${topicSlug}.mp4` : `Day_${dayId}.mp4`;
    res.download(videoPath, filename);
  });

  app.get("/api/download/all", async (_req, res) => {
    const imagesDir = path.join(process.cwd(), "generated", "images");
    const videosDir = path.join(process.cwd(), "generated", "videos");
    const days = await storage.getAllLessonDays();
    const dayMap = new Map(days.map(d => [d.id, d.topic]));

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=all_media.zip");

    const archive = archiver("zip", { zlib: { level: 5 } });
    archive.on("error", (err) => {
      console.error("Archive error:", err);
      res.status(500).end();
    });
    archive.pipe(res);

    if (fs.existsSync(imagesDir)) {
      const imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith(".png"));
      for (const file of imageFiles) {
        const match = file.match(/day_(\d+)\.png/);
        const dayId = match ? parseInt(match[1]) : 0;
        const topic = dayMap.get(dayId);
        const zipName = topic ? `Day_${dayId}_${sanitizeFilename(topic)}.png` : file;
        archive.file(path.join(imagesDir, file), { name: `images/${zipName}` });
      }
    }
    if (fs.existsSync(videosDir)) {
      const videoFiles = fs.readdirSync(videosDir).filter(f => f.endsWith(".mp4"));
      for (const file of videoFiles) {
        const match = file.match(/day_(\d+)\.mp4/);
        const dayId = match ? parseInt(match[1]) : 0;
        const topic = dayMap.get(dayId);
        const zipName = topic ? `Day_${dayId}_${sanitizeFilename(topic)}.mp4` : file;
        archive.file(path.join(videosDir, file), { name: `videos/${zipName}` });
      }
    }

    await archive.finalize();
  });

  // ===== PUBLIC BLOG ROUTES =====
  app.get("/api/blog", async (_req, res) => {
    const posts = await storage.getPublishedBlogPosts();
    const postsWithAuthor = await Promise.all(
      posts.map(async (post) => {
        const author = post.authorId ? await storage.getUserById(post.authorId) : null;
        return { ...post, authorName: author?.username || "Unknown" };
      })
    );
    res.json(postsWithAuthor);
  });

  app.get("/api/blog/:slug", async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const author = post.authorId ? await storage.getUserById(post.authorId) : null;
    res.json({ ...post, authorName: author?.username || "Unknown" });
  });

  // ===== PUBLIC SITE SETTINGS =====
  app.get("/api/settings", async (_req, res) => {
    const settings = await storage.getAllSettings();
    const result: Record<string, string> = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json(result);
  });

  // ===== ADMIN ROUTES =====

  // Admin Analytics
  app.get("/api/admin/analytics", requireRole("administrator", "editor"), async (_req, res) => {
    const allUsers = await storage.getAllUsers();
    const allPosts = await storage.getAllBlogPosts();
    const stats = await storage.getStats();
    const publishedPosts = allPosts.filter(p => p.status === "published").length;
    const draftPosts = allPosts.filter(p => p.status === "draft").length;
    res.json({
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => u.status === "active").length,
      blockedUsers: allUsers.filter(u => u.status === "blocked").length,
      totalBlogPosts: allPosts.length,
      publishedPosts,
      draftPosts,
      totalLessons: stats.totalDays,
      imagesGenerated: stats.imagesCompleted,
      videosGenerated: stats.videosCompleted,
      imagesFailed: stats.imagesFailed,
      videosFailed: stats.videosFailed,
    });
  });

  // Admin User Management
  app.get("/api/admin/users", requireRole("administrator"), async (_req, res) => {
    const allUsers = await storage.getAllUsers();
    const safeUsers = allUsers.map(({ password, ...u }) => u);
    res.json(safeUsers);
  });

  app.post("/api/admin/users", requireRole("administrator"), async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
      }
      const existing = await storage.getUserByUsername(username);
      if (existing) return res.status(400).json({ message: "Username already exists" });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role: role || "viewer",
        status: "active",
      });
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/admin/users/:id", requireRole("administrator"), async (req, res) => {
    const id = parseInt(req.params.id);
    const { role, status, email, password } = req.body;
    const updateData: any = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    await storage.updateUser(id, updateData);
    res.json({ message: "User updated" });
  });

  app.delete("/api/admin/users/:id", requireRole("administrator"), async (req, res) => {
    const id = parseInt(req.params.id);
    if ((req.user as any)?.id === id) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }
    await storage.deleteUser(id);
    res.json({ message: "User deleted" });
  });

  // Admin Blog Management
  const blogUpload = multer({
    dest: path.join(process.cwd(), "uploads", "blog"),
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  app.get("/api/admin/blog", requireRole("administrator", "editor", "writer"), async (_req, res) => {
    const posts = await storage.getAllBlogPosts();
    const postsWithAuthor = await Promise.all(
      posts.map(async (post) => {
        const author = post.authorId ? await storage.getUserById(post.authorId) : null;
        return { ...post, authorName: author?.username || "Unknown" };
      })
    );
    res.json(postsWithAuthor);
  });

  app.post("/api/admin/blog", requireRole("administrator", "editor", "writer"), blogUpload.single("coverImage"), async (req, res) => {
    try {
      const { title, content, excerpt, status } = req.body;
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      let coverImage: string | undefined;
      if (req.file) {
        const blogImagesDir = path.join(process.cwd(), "generated", "blog");
        if (!fs.existsSync(blogImagesDir)) fs.mkdirSync(blogImagesDir, { recursive: true });
        const ext = path.extname(req.file.originalname) || ".jpg";
        const destPath = path.join(blogImagesDir, `${slug}${ext}`);
        fs.copyFileSync(req.file.path, destPath);
        fs.unlinkSync(req.file.path);
        coverImage = `/generated/blog/${slug}${ext}`;
      }
      const post = await storage.createBlogPost({
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200),
        coverImage,
        authorId: (req.user as any)?.id,
        status: status || "draft",
        publishedAt: status === "published" ? new Date() : null,
      });
      res.json(post);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/admin/blog/:id", requireRole("administrator", "editor", "writer"), blogUpload.single("coverImage"), async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content, excerpt, status } = req.body;
    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (excerpt) updateData.excerpt = excerpt;
    if (status) {
      updateData.status = status;
      if (status === "published") updateData.publishedAt = new Date();
    }
    if (req.file) {
      const blogImagesDir = path.join(process.cwd(), "generated", "blog");
      if (!fs.existsSync(blogImagesDir)) fs.mkdirSync(blogImagesDir, { recursive: true });
      const slug = title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `post-${id}`;
      const ext = path.extname(req.file.originalname) || ".jpg";
      const destPath = path.join(blogImagesDir, `${slug}${ext}`);
      fs.copyFileSync(req.file.path, destPath);
      fs.unlinkSync(req.file.path);
      updateData.coverImage = `/generated/blog/${slug}${ext}`;
    }
    await storage.updateBlogPost(id, updateData);
    res.json({ message: "Blog post updated" });
  });

  app.delete("/api/admin/blog/:id", requireRole("administrator", "editor"), async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteBlogPost(id);
    res.json({ message: "Blog post deleted" });
  });

  // Admin Inline Media Upload (for blog content)
  const mediaUpload = multer({
    dest: path.join(process.cwd(), "uploads", "media"),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image and video files are allowed"));
      }
    },
  });

  app.post("/api/admin/upload-media", requireRole("administrator", "editor", "writer"), mediaUpload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const mediaDir = path.join(process.cwd(), "generated", "media");
      if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

      const timestamp = Date.now();
      const ext = path.extname(req.file.originalname) || (req.file.mimetype.startsWith("video/") ? ".mp4" : ".jpg");
      const safeName = req.file.originalname.replace(/[^a-zA-Z0-9_\-.]/g, "_").substring(0, 60);
      const filename = `${timestamp}_${safeName}`;
      const destPath = path.join(mediaDir, filename);
      fs.copyFileSync(req.file.path, destPath);
      fs.unlinkSync(req.file.path);

      const url = `/generated/media/${filename}`;
      const type = req.file.mimetype.startsWith("video/") ? "video" : "image";
      res.json({ url, type, filename });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Admin Site Settings
  app.get("/api/admin/settings", requireRole("administrator"), async (_req, res) => {
    const settings = await storage.getAllSettings();
    const result: Record<string, string> = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json(result);
  });

  app.patch("/api/admin/settings", requireRole("administrator"), async (req, res) => {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === "string") {
        await storage.upsertSetting(key, value);
      }
    }
    res.json({ message: "Settings updated" });
  });

  // Profile Update (change own username/password)
  app.patch("/api/auth/profile", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) return res.status(401).json({ message: "Not authenticated" });

      const { username, currentPassword, newPassword } = req.body;
      const user = await storage.getUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) return res.status(400).json({ message: "Current password is incorrect" });

      const updateData: any = {};

      if (username && username !== user.username) {
        const existing = await storage.getUserByUsername(username);
        if (existing) return res.status(400).json({ message: "Username already taken" });
        updateData.username = username;
      }

      if (newPassword) {
        if (newPassword.length < 6) {
          return res.status(400).json({ message: "New password must be at least 6 characters" });
        }
        updateData.password = await bcrypt.hash(newPassword, 10);
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No changes to save" });
      }

      await storage.updateUser(userId, updateData);

      const updated = await storage.getUserById(userId);
      if (updated) {
        (req.user as any).username = updated.username;
      }

      res.json({ message: "Profile updated successfully", username: updated?.username });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  return httpServer;
}
