# Smarthinkerz Studio

## Overview
A full-stack web application that serves as an AI-powered media generation agent. Users upload content documents (PDF, DOCX, TXT, CSV, MD) — lesson plans, training manuals, marketing briefs, manuscripts, or guides — and the AI parses them to extract sections. Then it generates unique 16:9 images and videos for each section. Supports documents of any size (tested with 220+ sections, designed for 600+). Serves 5 industries: Education, Content Creators, Businesses, Marketers, and Authors/Publishers.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL via Drizzle ORM
- **AI**: OpenAI API (user's own OPENAI_API_KEY) - gpt-4o-mini for parsing, gpt-image-1 for images
- **Video**: ffmpeg with Ken Burns zoom effect, text overlays for day label and topic
- **File Upload**: Multer for multipart form handling
- **Document Parsing**: pdf-parse (PDF), mammoth (DOCX), native text (TXT/CSV/MD)
- **Downloads**: Individual file downloads + bulk zip via archiver

## Pages & Routing
- `/` - Landing page (marketing, pricing, feature showcase with real generated images)
- `/dashboard` - Main app dashboard (upload, generate, manage media)

## Key Features
1. **Landing Page**: Smarthinkerz Studio branded marketing page with use cases, style showcase, tabbed pricing, testimonials, CTA
2. **Document Upload & AI Parsing**: Upload any content documents; AI extracts sections and descriptions
3. **Batch Media Generation**: Generates 1536x1024 images using gpt-image-1, videos via ffmpeg
4. **Media Style Selection**: Choose from 7 styles for images and videos: Photorealistic, Illustration, Cartoon, 3D Render, Watercolor, Minimalist, Cinematic
5. **Progress Dashboard**: Real-time tracking of generation progress with grid/list views
6. **Media Viewer**: View generated images and videos per section with individual download buttons
7. **Generation Controls**: Start/Pause/Resume/Stop generation, retry failed items
8. **Downloads**: Individual image/video download with Day+Topic filenames, bulk Download All as zip
9. **Scalability**: Rate limit handling with retries, chunk-based parsing for large documents
10. **Multi-Industry Support**: Pricing and messaging tailored for 5 industries with tabbed pricing selector

## File Structure
- `shared/schema.ts` - Database schema (lesson_days, generation_jobs, uploaded_documents)
- `server/routes.ts` - API endpoints including upload, generation, and downloads
- `server/storage.ts` - Database storage layer
- `server/generation-engine.ts` - Handles batch image/video generation with pause/resume/stop
- `server/document-parser.ts` - AI-powered document parsing with chunking and retry logic
- `server/db.ts` - Database connection
- `server/replit_integrations/` - AI integration code (OpenAI, image generation)
- `client/src/App.tsx` - Router setup (landing at /, dashboard at /dashboard)
- `client/src/pages/landing.tsx` - Marketing landing page with showcase
- `client/src/pages/dashboard.tsx` - Main dashboard page
- `client/src/components/file-upload.tsx` - File upload with drag & drop
- `client/src/components/media-viewer.tsx` - Image/video viewer dialog with download buttons
- `generated/` - Output directory for generated images and videos

## Database Tables
- `lesson_days` - Stores each lesson with topic, description, and generation status (field: originalContent)
- `generation_jobs` - Tracks batch generation job progress
- `uploaded_documents` - Records of uploaded files and parsing status

## Important Notes
- Image size: 1536x1024 (OpenAI supported landscape format)
- Video: 6-second MP4 with Ken Burns zoom, day label overlay, topic overlay
- Document parser splits by Day boundaries (max 40,000 chars per chunk) with retry on rate limits
- Image generation has retry logic (3 attempts) with exponential backoff for rate limits
- Uploading a new document clears previous generated files and lesson data
- Download filenames: Day_{N}_{Sanitized_Topic}.png/mp4
- Landing page showcases real generated images from /generated/images/

## Pricing Tiers (Landing Page - Not Yet Enforced, Tabbed by Industry)
- Free ($0): Entry-level, limited outputs, basic styles (varies by industry)
- Pro ($19/mo): Mid-tier, more outputs, Illustration/Cartoon/Minimalist
- Business ($49/mo): Professional, adds Photorealistic/Watercolor
- Premium ($99/mo): All 7 styles, high volume, team accounts
- Enterprise (Custom): Unlimited, API, white-label, SLA
- Industries: Education, Content Creators, Businesses, Marketers, Authors/Publishers

## Dependencies
- multer, pdf-parse, mammoth - File upload and document parsing
- openai - AI integration for document parsing and image generation
- archiver - Zip file creation for bulk downloads
