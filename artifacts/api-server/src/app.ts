import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Clerk proxy must be before body parsers
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use env vars directly — publishableKeyFromHost can return undefined on
// non-Clerk hostnames (e.g. Replit dev domains), breaking token verification.
app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  }),
);

app.use("/api", router);

// ── Production: serve the built frontend & SPA fallback ───────────────────────
if (process.env.NODE_ENV === "production") {
  // Resolve path relative to the compiled bundle location (dist/index.mjs)
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const staticDir =
    process.env.STATIC_FILES_DIR ??
    path.join(__dirname, "../../tajweed-platform/dist/public");

  if (fs.existsSync(staticDir)) {
    app.use(express.static(staticDir));

    // SPA fallback — serve index.html for any non-API route
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticDir, "index.html"));
    });

    logger.info({ staticDir }, "Serving frontend static files");
  } else {
    logger.warn(
      { staticDir },
      "Static files directory not found — frontend not served",
    );
  }
}

export default app;
