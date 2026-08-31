import { Router, Request, Response } from "express";
import { testAndMigratePostgres, getPostgresDDL, isPlaceholderDbUrl, getPool } from "../postgres";
import { sendSuccess, sendError } from "../utils/response";
import { config } from "../config/env";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  sendSuccess(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "ITPMS Backend API",
    version: "1.0.0",
    environment: config.nodeEnv,
  }, "ITPMS API is operating normally");
});

router.get("/db", async (req: Request, res: Response) => {
  const dbUrl = config.databaseUrl;
  const isPlaceholder = isPlaceholderDbUrl(dbUrl);
  
  if (isPlaceholder || !dbUrl) {
    return sendSuccess(res, {
      connected: false,
      storageMode: "json_file_store",
      message: "No PostgreSQL DATABASE_URL configured or placeholder URI in use. Operating in local JSON storage mode.",
    });
  }

  const pool = getPool();
  if (!pool) {
    return sendSuccess(res, {
      connected: false,
      storageMode: "json_file_store",
      message: "PostgreSQL pool uninitialized.",
    });
  }

  try {
    const startTime = Date.now();
    const result = await pool.query("SELECT NOW() as server_time, current_database() as database_name, version() as pg_version");
    const latencyMs = Date.now() - startTime;

    return sendSuccess(res, {
      connected: true,
      storageMode: "postgresql",
      latencyMs,
      serverTime: result.rows[0]?.server_time,
      databaseName: result.rows[0]?.database_name,
      pgVersion: result.rows[0]?.pg_version,
      poolStats: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
      },
    }, "PostgreSQL database connection verified");
  } catch (err: any) {
    return sendError(res, `Database connectivity check failed: ${err?.message || err}`, 503, [
      { field: "databaseUrl", message: err?.message || "Connection refused" },
    ]);
  }
});

router.get("/postgres/ddl", (req: Request, res: Response) => {
  res.type("text/plain").send(getPostgresDDL());
});

router.post("/postgres/test", async (req: Request, res: Response) => {
  const { connectionString } = req.body;
  if (!connectionString) {
    return sendError(res, "connectionString is required.", 400);
  }

  const result = await testAndMigratePostgres(connectionString);
  sendSuccess(res, result);
});

export default router;
