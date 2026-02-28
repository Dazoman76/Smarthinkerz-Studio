# Smarthinkerz Studio

## Overview
A full-stack web application that serves as an AI-powered media generation agent. Users upload content documents (PDF, DOCX, TXT, CSV, MD) — lesson plans, training manuals, marketing briefs, manuscripts, or guides — and the AI parses them to extract sections. Then it generates unique 16:9 images and videos for each section. Supports documents of any size (tested with 220+ sections, designed for 600+). Serves 5 industries: Education, Content Creators, Businesses, Marketers, and Authors/Publishers.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL via Drizzle ORM
- **AI**: OpenAI API (user's own OPENAI_API_KEY) - gpt-4o-mini for parsing, gpt-image-1 for images
- **Video**: ffmpeg with 10 dynamic motion presets (sweep, zoom, drift, pan), fade transitions, animated text overlays
- **Auth**: Passport.js with local strategy, bcrypt password hashing, express-session
- **Email Notifications**: Resend API for generation completion alerts
- **File Upload**: Multer for multipart form handling
- **Document Parsing**: pdf-parse (PDF), mammoth (DOCX), native text (TXT/CSV/MD)
- **Downloads**: Individual file downloads + bulk zip via archiver

## Pages & Routing
- `/` - Landing page (marketing, pricing, feature showcase with real generated images)
- `/dashboard` - Main app dashboard (upload, generate, manage media)
- `/blog` - Public blog listing (published posts)
- `/blog/:slug` - Individual blog post view
- `/admin/login` - Admin authentication page
- `/admin` - Admin dashboard with analytics
- `/admin/blog` - Blog management (create, edit, publish, delete posts)
- `/admin/blog/:id` - Blog post editor
- `/admin/clients` - Client management (subscription tiers: free/basic/advanced/premium, upgrade/downgrade, block, delete)
- `/admin/team` - Team member management (assign roles: viewer/writer/editor/administrator)
- `/admin/settings` - Site settings editor (front page content)

## Key Features
1. **Landing Page**: Smarthinkerz Studio branded marketing page with use cases, style showcase, tabbed pricing, testimonials, CTA, Blog nav link
2. **Document Upload & AI Parsing**: Upload any content documents; AI extracts sections and descriptions
3. **Batch Media Generation**: Generates 1536x1024 images using gpt-image-1, videos via ffmpeg
4. **Media Style Selection**: Choose from 7 styles for images and videos: Photorealistic, Illustration, Cartoon, 3D Render, Watercolor, Minimalist, Cinematic
5. **Progress Dashboard**: Real-time tracking of generation progress with grid/list views
6. **Media Viewer**: View generated images and videos per section with individual download buttons
7. **Generation Controls**: Start/Pause/Resume/Stop generation, retry failed items
8. **Downloads**: Individual image/video download with Day+Topic filenames, bulk Download All as zip
9. **Scalability**: Rate limit handling with retries, chunk-based parsing for large documents
10. **Multi-Industry Support**: Pricing and messaging tailored for 5 industries with tabbed pricing selector
11. **Admin Dashboard**: Analytics overview (users, posts, media stats), protected by auth
12. **Blog System**: Public blog with cards, individual post view; admin blog editor with rich text toolbar, inline image/video upload at cursor, Markdown formatting, preview mode, draft/publish workflow
13. **Client Management**: Separate section for app users with subscription tiers (Free/Basic/Advanced/Premium); upgrade/downgrade, block/unblock, remove; search & filter
14. **Team Management**: Separate section for internal team members with role assignment (Viewer/Writer/Editor/Administrator); add/remove/block team members
15. **Site Settings**: Editable front page content (hero title, tagline, about text, CTA, footer)
16. **Email Notifications**: Resend-powered email alerts when media generation completes; configurable per-user via Profile page with test email support

## File Structure
- `shared/schema.ts` - Database schema (lesson_days, generation_jobs, uploaded_documents, users, blog_posts, site_settings, branding_settings)
- `server/routes.ts` - API endpoints including upload, generation, downloads, admin, blog, auth
- `server/storage.ts` - Database storage layer with CRUD for all tables
- `server/auth.ts` - Authentication setup (passport, sessions, middleware, default admin seeding)
- `server/generation-engine.ts` - Handles batch image/video generation with pause/resume/stop
- `server/document-parser.ts` - AI-powered document parsing with chunking and retry logic
- `server/db.ts` - Database connection
- `server/replit_integrations/` - AI integration code (OpenAI, image generation)
- `client/src/App.tsx` - Router setup with admin route protection
- `client/src/hooks/use-auth.ts` - Auth hook (login/logout/user state)
- `client/src/pages/landing.tsx` - Marketing landing page with showcase
- `client/src/pages/dashboard.tsx` - Main dashboard page
- `client/src/pages/blog.tsx` - Public blog listing
- `client/src/pages/blog-post.tsx` - Individual blog post view
- `client/src/pages/admin-login.tsx` - Admin login page
- `client/src/pages/admin/layout.tsx` - Admin sidebar layout
- `client/src/pages/admin/dashboard.tsx` - Admin analytics dashboard
- `client/src/pages/admin/blog-list.tsx` - Blog post management
- `client/src/pages/admin/blog-editor.tsx` - Blog post create/edit
- `client/src/pages/admin/users.tsx` - User management
- `client/src/pages/admin/team.tsx` - Team management
- `client/src/pages/admin/settings.tsx` - Site settings editor
- `client/src/pages/admin/branding.tsx` - Branding options (logo, colors, overlay, fonts)
- `client/src/components/file-upload.tsx` - File upload with drag & drop
- `client/src/components/media-viewer.tsx` - Image/video viewer dialog with download buttons
- `generated/` - Output directory for generated images, videos, and blog images

## Database Tables
- `lesson_days` - Stores each lesson with topic, description, and generation status
- `generation_jobs` - Tracks batch generation job progress
- `uploaded_documents` - Records of uploaded files and parsing status
- `users` - User accounts with roles (viewer/writer/editor/administrator) and status (active/blocked)
- `blog_posts` - Blog posts with title, slug, content, excerpt, cover image, status (draft/published)
- `site_settings` - Key-value pairs for editable front page content
- `branding_settings` - Logo, colors, overlay, font preferences per user

## Auth System
- Default admin: username=admin, password=admin123 (created on startup if not exists)
- Roles: viewer, writer, editor, administrator
- Session-based auth via express-session + passport-local
- Protected admin routes require authentication + appropriate role

## Design System (Landing Page)
- **Font**: Lato, sans-serif (300 Light / 400 Regular / 600 SemiBold / 700 Bold)
- **Nav**: Dark gradient #0F172A→#1E293B, 80px height, tagline #22D3EE, links #CBD5E1 hover #FFFFFF, button #2563EB
- **Hero**: Gradient #1E3A8A→#2563EB→#1E293B, radial cyan glow, white headings, #E2E8F0 subtext, CTA #22D3EE
- **Section Rhythm**: Dark Hero → Light (#F8FAFC) → White → Light → White → ... → Dark CTA → Dark Footer
- **Cards**: White bg, 1px solid #E2E8F0, radius 16px, shadow 0 10px 30px rgba(0,0,0,0.05), hover translateY(-6px)
- **Use Case Accent Bars**: Education #2563EB, Creators #7C3AED, Business #F59E0B, Marketers #F43F5E, Authors #10B981
- **Tables**: Border #E2E8F0, header text #0F172A, check #10B981, negative #94A3B8
- **Pricing**: White cards, radius 18px, Most Popular badge #22D3EE, button #2563EB, Enterprise border 2px solid #2563EB
- **CTA**: Gradient #22D3EE→#2563EB→#1E293B, white heading, white button
- **Footer**: Dark #0F172A, headings #FFFFFF, links #9CA3AF, hover #22D3EE, copyright #64748B
- **Border Radius**: Buttons 10-12px, Cards 16px, Pricing 18px, Badges 20px
- **Max Width**: 1200px, Section padding 100px vertical, Card gap 32px

## Important Notes
- Image size: 1536x1024 (OpenAI supported landscape format)
- Video: 6-second MP4 with 10 motion presets cycled by dayId, fade-in/out, sliding text animations
- Blog content supports Markdown + inline media via `[image:url]` and `[video:url]` tags
- Inline media uploads via POST /api/admin/upload-media, stored in generated/media/
- Document parser splits by Day boundaries (max 40,000 chars per chunk) with retry on rate limits
- Image generation has retry logic (3 attempts) with exponential backoff for rate limits
- Uploading a new document clears previous generated files and lesson data
- Download filenames: Day_{N}_{Sanitized_Topic}.png/mp4
- Landing page showcases real generated images from /generated/images/
- Blog images stored in generated/blog/

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
- passport, passport-local, express-session, bcrypt - Authentication
