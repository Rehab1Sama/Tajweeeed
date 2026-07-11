# Agent Memory Index

- [Tajweed platform architecture](tajweed-platform-arch.md) — full-stack Tajweed learning app: React+Vite frontend, Express API server, Postgres/Drizzle, Clerk auth, Orval codegen.
- [DB rebuild after schema changes](db-rebuild.md) — after adding new schema files, must run `pnpm run typecheck:libs` (tsc --build) to regenerate dist declarations; @workspace/db has no separate build script.
- [Mobile app architecture](mobile-app-arch.md) — Expo app with Clerk Core v3 email/password auth, student tabs, API via setAuthTokenGetter.
- [Teacher bootstrapping](teacher-bootstrap.md) — POST /api/setup/make-teacher (SESSION_SECRET as shared secret) provisions first teacher; AdminLayout has role guard.
