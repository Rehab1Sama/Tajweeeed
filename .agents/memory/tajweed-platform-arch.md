---
name: Tajweed platform architecture
description: Key decisions and patterns for نور التجويد platform
---

## Stack
- Frontend: `artifacts/tajweed-platform` (React+Vite, previewPath `/`)
- Backend: `artifacts/api-server` (Express, port 8080, routes under `/api`)
- DB: Postgres + Drizzle ORM (`lib/db/src/schema/`)
- Auth: Clerk (Replit-managed). Secrets: CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY, VITE_CLERK_PUBLISHABLE_KEY
- Codegen: Orval from `lib/api-spec/openapi.yaml` → `lib/api-client-react` (hooks) + `lib/api-zod` (validators)

## Access Control Model
- Role stored in local `users` table (not Clerk metadata): `teacher` | `student`
- `requireAuth`: returns 401 if no clerkId OR no local DB user (forces /api/users/sync first)
- `requireTeacher`: checks `localUser.role === "teacher"`
- Active enrollment gating: submissions/messages/audio require `enrollments.status = 'active'`

## Key Design Decisions
- **Why `tailwindcss({ optimize: false })`**: Clerk themes break with Tailwind CSS optimization enabled; must be disabled.
- **Why users/sync first**: Clerk JIT provisioning — after sign-in, frontend calls `POST /api/users/sync` before accessing any protected route.
- **Role routing**: HomeRedirect → RoleRedirect checks `useGetCurrentUser().role`; teachers → `/admin`, students → `/dashboard`
- **Enrollment IDOR fix**: `GET /enrollments/:id` checks ownership (`studentId === user.id`) for non-teachers

## Seeded Data
- 18 Tajweed rules (10 Level 1, 8 Level 2)
- 2 courses (Level 1 active, Level 2 inactive)
- 4 lessons, comment templates, daily wird, audio library items
- Seed script: `artifacts/api-server/src/seed.ts` (run with `npx tsx`)
