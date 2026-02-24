# AI Media Generation Agent

## Overview
A full-stack web application that serves as an AI-powered media generation agent. Users upload lesson plan documents (PDF, DOCX, TXT, CSV, MD), and the AI parses them to extract individual lessons. Then it generates unique 16:9 images and videos for each lesson day.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL via Drizzle ORM
- **AI**: OpenAI via Replit AI Integrations (no API key required)
- **File Upload**: Multer for multipart form handling
- **Document Parsing**: pdf-parse (PDF), mammoth (DOCX), native text (TXT/CSV/MD)

## Key Features
1. **Document Upload & AI Parsing**: Upload lesson plan documents; AI extracts lesson topics and descriptions
2. **Batch Media Generation**: Generates images using OpenAI's gpt-image-1 model
3. **Progress Dashboard**: Real-time tracking of generation progress with grid/list views
4. **Media Viewer**: View generated images and videos per lesson day
5. **Generation Controls**: Start/stop/retry failed generation jobs

## File Structure
- `shared/schema.ts` - Database schema (lesson_days, generation_jobs, uploaded_documents)
- `server/routes.ts` - API endpoints including upload and generation
- `server/storage.ts` - Database storage layer
- `server/generation-engine.ts` - Handles batch image/video generation
- `server/document-parser.ts` - AI-powered document parsing using OpenAI
- `server/db.ts` - Database connection
- `server/replit_integrations/` - AI integration code (OpenAI, image generation)
- `client/src/pages/dashboard.tsx` - Main dashboard page
- `client/src/components/file-upload.tsx` - File upload with drag & drop
- `client/src/components/media-viewer.tsx` - Image/video viewer dialog
- `generated/` - Output directory for generated images and videos

## Database Tables
- `lesson_days` - Stores each lesson with topic, description, and generation status
- `generation_jobs` - Tracks batch generation job progress
- `uploaded_documents` - Records of uploaded files and parsing status

## Dependencies
- multer, pdf-parse, mammoth - File upload and document parsing
- openai - AI integration for document parsing and image generation
- p-limit, p-retry - Rate limiting and retry logic for batch processing
