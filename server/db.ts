// server/db.ts
import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined");
}

// Helpful debug (Render + local)
console.log("🛢️ Connecting to DB:", DATABASE_URL.replace(/:\/\/.*@/, "://****@"));

const isRender =
  DATABASE_URL.includes("render.com") ||
  process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: isRender
    ? { rejectUnauthorized: false } // Render + Local → Render DB
    : false, // Local → Local DB
  max: 5,                 // small pool (Render free tier safe)
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// --- logs (very important while debugging) ---
pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error(" PostgreSQL pool error", err);
});

export const db = drizzle(pool, { schema });
