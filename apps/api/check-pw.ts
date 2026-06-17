import "dotenv/config";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const res = await pool.query(
  "SELECT id, account_id, provider_id, user_id, substring(password, 1, 80) as password_preview FROM account WHERE provider_id = 'credential' LIMIT 3"
);
console.log(JSON.stringify(res.rows, null, 2));
await pool.end();
