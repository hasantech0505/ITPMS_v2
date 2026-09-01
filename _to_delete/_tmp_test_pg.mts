import "dotenv/config";
import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
try {
  const res = await pool.query("SELECT COUNT(*) FROM residents");
  console.log("Connected! Resident count:", res.rows[0].count);
} catch (e: any) {
  console.error("Connection failed:", e.message);
} finally {
  await pool.end();
}
