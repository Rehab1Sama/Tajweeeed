# نور التجويد

A Tajweed learning platform for women to study Quranic recitation rules with structured, community-based follow-up.

## Run & Operate

- Three workflows start automatically: **API Server**, **نور التجويد** (frontend), **Component Preview Server**
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required secrets: `DATABASE_URL` (runtime-managed by Replit), `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` (all auto-provisioned by Replit Clerk integration)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend**: React + Vite + Tailwind CSS v4 + Radix UI + Wouter + TanStack Query + Framer Motion
- **API**: Express 5
- **Auth**: Clerk (Replit-managed, cookie-based on web)
- **DB**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec`)
- **Build**: esbuild (via `artifacts/api-server/build.mjs`)
- **Logging**: Pino

## Where things live

- `artifacts/tajweed-platform/` — React/Vite frontend, entry at `src/main.tsx`
- `artifacts/api-server/` — Express API server, entry at `src/index.ts`, app wired in `src/app.ts`
- `lib/db/src/schema/` — Drizzle schema (source of truth for DB shape)
- `lib/api-spec/` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/` — Orval-generated React hooks and Zod schemas

## Architecture decisions

- **Codegen-first**: The OpenAPI spec in `lib/api-spec` drives both Zod validation and React Query hooks via Orval. Run `pnpm --filter @workspace/api-spec run codegen` after changing the spec.
- **Clerk proxy via Express**: The frontend routes Clerk auth requests through `/api/__clerk` on the Express server. This is handled by `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts`.
- **Cookie-based auth on web**: Do not add Bearer token handling to browser API calls — Clerk session cookies are used automatically. Bearer tokens are only for mobile clients.
- **Single esbuild bundle**: The API server is compiled to a single `dist/index.mjs` by `build.mjs` before each `dev` start.

## Product

A women-only online Tajweed academy. Users can apply for enrollment, sign in, access a student dashboard, and admins can manage applications and students.

## User preferences

- Language: Arabic (RTL interface)

## Gotchas

- After modifying `lib/db` schema files, run `pnpm run typecheck:libs` (tsc --build) to regenerate declaration files before the API server can import them.
- The `@clerk/shared` build script is intentionally ignored by pnpm (`pnpm approve-builds` warning is expected and harmless).
- The API server build produces a large bundle (~2.7MB) — this is expected and not a problem.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `clerk-auth` skill for Replit-managed Clerk auth setup details
