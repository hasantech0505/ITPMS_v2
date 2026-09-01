/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { testAndMigratePostgres, syncDataToPostgres, isPlaceholderDbUrl, closePool } from "./server/postgres";
import { config } from "./server/config/env";

import authRoutes from "./server/routes/auth.routes";
import rbacRoutes from "./server/routes/rbac.routes";
import userRoutes from "./server/routes/user.routes";
import residentRoutes from "./server/routes/resident.routes";
import entityRoutes from "./server/routes/entity.routes";
import uploadRoutes, { UPLOAD_ROOT } from "./server/routes/upload.routes";
import aiRoutes from "./server/routes/ai.routes";
import healthRoutes from "./server/routes/health.routes";
import { EntityService } from "./server/services/entity.service";
import { RbacRepository } from "./server/repositories/rbac.repository";
import { applyPendingResidentCorrections, applyPendingResidentCorrectionsV2, cleanupLeftoverTestResident } from "./server/startup/applyResidentCorrections";
import { errorHandler } from "./server/middleware/errorHandler";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Seed RBAC roles and permissions
  RbacRepository.seedRbacData().catch((err) => console.warn("RBAC seed error:", err));

  // NOTE (2026-09-01, later): the two resident-correction backfills used to
  // fire here, unawaited, at the very top of startup - racing against the
  // Postgres handshake below. `EntityRepository.getFullState()` "keeps the
  // JSON cache warm" by overwriting db_store.json with whatever Postgres
  // currently holds every time it's called (see server/repositories/
  // entity.repository.ts), and that overwrite could land in the middle of
  // these corrections' own read-modify-write loop over the SAME file,
  // clobbering most of the in-progress updates. That race is the real
  // reason a fresh boot logged "1 updated, 76 not found" / "1 updated, 165
  // not found" here even though every id genuinely existed in db_store.json
  // moments before and after. Moved below, into the sequential Postgres
  // handshake chain, so nothing else touches db_store.json while they run.

  // Global Middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // CORS Middleware for independent deployment (e.g. Netlify frontend, Render/Railway/Docker backend)
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", config.corsOrigins);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // --- API MOUNT POINTS ---
  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/rbac", rbacRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/residents", residentRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/uploads", uploadRoutes);
  app.use("/api", entityRoutes);

  // Global Error Handler
  app.use(errorHandler);

  // Serve uploaded files (and everything else in public/) directly from source,
  // regardless of dev/prod mode. In prod, `vite build` also copies public/ into
  // dist/ at build time, but that copy only reflects the folder as of the last
  // build -- a file uploaded afterwards would 404 without this. Placed before
  // the dev/prod branch below so it takes precedence for matching paths.
  app.use(express.static(path.join(process.cwd(), "public")));

  // When UPLOAD_DIR points somewhere else (a mounted volume on a host with an
  // ephemeral filesystem), serve that too -- runtime uploads live there, not in
  // the repo's public/ folder.
  if (UPLOAD_ROOT !== path.join(process.cwd(), "public")) {
    app.use(express.static(UPLOAD_ROOT));
  }

  // --- VITE MIDDLEWARE (DEV) & STATIC SERVING (PROD) ---
  if (config.nodeEnv !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // --- DATABASE HANDSHAKE ---
  const dbUrl = config.databaseUrl;
  if (dbUrl && !isPlaceholderDbUrl(dbUrl)) {
    console.log("⚡ Auto-detecting DATABASE_URL. Initiating startup database handshake & migrations...");
    testAndMigratePostgres(dbUrl)
      .then(async (res) => {
        if (res.success) {
          console.log("✅ Startup PostgreSQL migration finished successfully.");

          // Pull Postgres into db_store.json as a consistent baseline FIRST,
          // so the corrections' own readDB()/writeDB() calls below aren't
          // racing against this same cache-warming overwrite (see NOTE at
          // the top of startServer()).
          await EntityService.getFullState();

          // One-time backfills: real district/industry/activityType/phone
          // for residents (from the official register Excel + address-
          // derived districts). Applied sequentially - not fire-and-forget -
          // now that server/postgres.ts's residents INSERT/UPSERT actually
          // covers the full column set, so these persist to Postgres too via
          // ResidentRepository.updateResident()'s own saveDocToPostgres call.
          await applyPendingResidentCorrections();
          await applyPendingResidentCorrectionsV2();
          await cleanupLeftoverTestResident();

          // Re-read the now-corrected state (Postgres already has the
          // per-resident correction writes from above) and push it through
          // one more full sync pass so every OTHER collection is reconciled
          // too, same as before.
          const fullState = await EntityService.getFullState();
          syncDataToPostgres(dbUrl, fullState).catch((e) => console.warn("Initial background sync:", e.message));
        } else {
          console.warn("⚠️ PostgreSQL handshake non-blocking warning:", res.message);
        }
      })
      .catch((err) => {
        console.warn("⚠️ PostgreSQL auto-handshake error:", err.message);
      });
  } else {
    console.log("ℹ️ Running in default local storage mode (db_store.json). Set DATABASE_URL to enable PostgreSQL.");
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 ITPMS Backend Engine running on http://0.0.0.0:${PORT}`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down server gracefully...`);
    server.close(async () => {
      console.log("HTTP server closed.");
      await closePool();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
}

startServer();
