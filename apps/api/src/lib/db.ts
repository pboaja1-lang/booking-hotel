import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "../db/schema.js";
import ws from "ws";

// Enable WebSocket for non-browser environments (Node.js / Vercel)
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const pool = new Pool({ connectionString });

export const db = drizzle({ client: pool, schema });
