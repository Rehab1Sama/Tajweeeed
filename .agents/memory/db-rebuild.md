---
name: DB rebuild after schema changes
description: How to regenerate @workspace/db TypeScript declarations after schema edits
---

## Rule
After adding new schema files under `lib/db/src/schema/`, the dist declarations go stale. Run:

```bash
pnpm run typecheck:libs   # alias for: tsc --build
```

This regenerates `lib/db/dist/**/*.d.ts` using the composite TypeScript project reference.

**Why:** `@workspace/db` exports from `./src/index.ts` directly (no build script). But the api-server's TypeScript project references resolve via `dist/` declarations. Without rebuilding, all new table exports appear missing.

**How to apply:** Any time you add tables to `lib/db/src/schema/` and the api-server shows `Module "@workspace/db" has no exported member 'xyzTable'` errors, this is the fix.
