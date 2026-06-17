import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "../db/schema.js";
import path from "path";

const dbPath = path.resolve(process.cwd(), ".data/pglite");
const client = new PGlite(dbPath);

export const db = drizzle(client, { schema });


