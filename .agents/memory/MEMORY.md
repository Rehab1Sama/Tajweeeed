# Agent Memory Index

- [Tajweed platform architecture](tajweed-platform-arch.md) — full-stack Tajweed learning app: React+Vite frontend, Express API server, Postgres/Drizzle, Clerk auth, Orval codegen.
- [DB rebuild after schema changes](db-rebuild.md) — after adding new schema files, must run `pnpm run typecheck:libs` (tsc --build) to regenerate dist declarations; @workspace/db has no separate build script.
