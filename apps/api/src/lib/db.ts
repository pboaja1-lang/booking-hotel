import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { Pool } from "@neondatabase/serverless";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "../db/schema.js";
import path from "path";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

let db: any;

if (connectionString) {
  const pool = new Pool({ connectionString });
  db = drizzleNeon(pool, { schema });
} else {
  const dbPath = path.resolve(process.cwd(), ".data/pglite");
  const client = new PGlite(dbPath);
  db = drizzlePglite(client, { schema });
}

export { db };

