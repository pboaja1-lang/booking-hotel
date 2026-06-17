import "dotenv/config";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

console.log("Connecting with @neondatabase/serverless...");

try {
  const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
  console.log("✅ Connected! Tables:", res.rows.map((r: any) => r.table_name));

  const users = await pool.query('SELECT id, name, email, role FROM "user"');
  console.log("Users:", JSON.stringify(users.rows, null, 2));

  await pool.end();
} catch (err: any) {
  console.error("❌ Error:", err.message);
  process.exit(1);
}
