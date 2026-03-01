# Objective
Add navigation links, blog system, admin dashboard with authentication, user management, analytics, blog management, and team member roles to the Smarthinkerz Studio platform.

# Tasks

### T001: Database Schema - Users, Blog Posts, Team Members
- **Blocked By**: []
- **Details**:
  - Add `users` table: id, username, email, password (hashed), role (admin/editor/writer/viewer), status (active/blocked), createdAt
  - Add `blog_posts` table: id, title, slug, excerpt, content, coverImage, authorId, status (draft/published), publishedAt, createdAt, updatedAt
  - Add `team_members` table (or use users with roles): viewer, editor, writer, administrator
  - Add `site_settings` table: key-value pairs for editable front page content
  - Create insert schemas and types
  - Update storage interface with CRUD operations
  - Run db:push to sync schema
  - Files: `shared/schema.ts`, `server/storage.ts`
  - Acceptance: Tables created, types exported, storage methods implemented

### T002: Authentication System
- **Blocked By**: [T001]
- **Details**:
  - Install express-session, passport, passport-local, bcrypt
  - Set up session-based auth with passport-local strategy
  - Create login/register routes: POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
  - Create default admin user on startup (admin/admin123 or from env)
  - Add auth middleware for protected routes
  - Files: `server/auth.ts`, `server/routes.ts`
  - Acceptance: Admin can log in, sessions persist, protected routes reject unauthenticated requests

### T003: Navigation Update + Blog Page (Public)
- **Blocked By**: [T001]
- **Details**:
  - Add navigation links to the landing page navbar: Use Cases, Pricing, Blog
  - Create `/blog` page showing published blog posts as preview cards (title, excerpt, cover image, "Read More" button)
  - Create `/blog/:slug` page showing full blog post with author info
  - Add route in App.tsx
  - Blog API: GET /api/blog (published posts), GET /api/blog/:slug (single post)
  - Files: `client/src/pages/blog.tsx`, `client/src/pages/blog-post.tsx`, `client/src/pages/landing.tsx`, `client/src/App.tsx`, `server/routes.ts`
  - Acceptance: Blog page shows published posts, individual posts render with author, nav links work

### T004: Admin Login Page
- **Blocked By**: [T002]
- **Details**:
  - Create `/admin/login` page with username/password form
  - On success, redirect to `/admin`
  - Use session-based auth
  - Files: `client/src/pages/admin-login.tsx`, `client/src/App.tsx`
  - Acceptance: Admin can log in and access dashboard

### T005: Admin Dashboard - Layout & Analytics
- **Blocked By**: [T004]
- **Details**:
  - Create `/admin` dashboard with sidebar navigation (Dashboard, Blog, Users, Team, Settings)
  - Dashboard home shows analytics: total users, active users, blog posts, media generated, recent activity
  - Analytics API: GET /api/admin/analytics
  - Protected by auth middleware
  - Files: `client/src/pages/admin/dashboard.tsx`, `client/src/pages/admin/layout.tsx`, `server/routes.ts`
  - Acceptance: Admin sees analytics after login

### T006: Admin Blog Management
- **Blocked By**: [T005]
- **Details**:
  - Blog list page: shows all posts (drafts + published) with status badges
  - Blog editor page: title, content (textarea/rich text), excerpt, cover image upload, save draft / update / publish buttons
  - API: POST /api/admin/blog, PATCH /api/admin/blog/:id, DELETE /api/admin/blog/:id
  - Image upload for blog covers
  - Files: `client/src/pages/admin/blog-list.tsx`, `client/src/pages/admin/blog-editor.tsx`, `server/routes.ts`
  - Acceptance: Admin can create, edit, draft, and publish blog posts with images

### T007: Admin User Management
- **Blocked By**: [T005]
- **Details**:
  - User list page: shows all users with role, status, actions
  - Add user, upgrade role, block/unblock, remove user
  - API: GET /api/admin/users, POST /api/admin/users, PATCH /api/admin/users/:id, DELETE /api/admin/users/:id
  - Files: `client/src/pages/admin/users.tsx`, `server/routes.ts`
  - Acceptance: Admin can manage users (add, edit role, block, delete)

### T008: Admin Team Management
- **Blocked By**: [T005]
- **Details**:
  - Team page: list team members with roles (viewer, editor, writer, administrator)
  - Add team member, change role, remove
  - API: reuses user management with role-based access
  - Files: `client/src/pages/admin/team.tsx`, `server/routes.ts`
  - Acceptance: Admin can add team members with specific roles

### T009: Admin Site Settings (Front Page Editor)
- **Blocked By**: [T005]
- **Details**:
  - Settings page: editable fields for hero title, tagline, about text, and section content
  - API: GET /api/admin/settings, PATCH /api/admin/settings
  - Front page reads from settings API (with fallback to defaults)
  - Files: `client/src/pages/admin/settings.tsx`, `server/routes.ts`, `client/src/pages/landing.tsx`
  - Acceptance: Admin can edit front page content that reflects on the live site
