import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "../db/schema.js";
import path from "path";

// On Vercel (serverless), use in-memory PGlite since filesystem is read-only
// Locally, use file-based PGlite for persistent storage
const isVercel = process.env.VERCEL === "1";
const dbPath = isVercel ? undefined : path.resolve(process.cwd(), ".data/pglite");
const client = new PGlite(dbPath);

export const db = drizzle(client, { schema });


