import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

export default defineConfig(
  connectionString
    ? {
        out: "./migrations",
        schema: "./src/db/schema.ts",
        dialect: "postgresql",
        dbCredentials: {
          url: connectionString,
        },
      }
    : {
        out: "./migrations",
        schema: "./src/db/schema.ts",
        dialect: "postgresql",
        driver: "pglite",
        dbCredentials: {
          url: "./.data/pglite",
        },
      }
);
