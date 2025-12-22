// server/db.ts
import { config } from "dotenv";
config(); // MUST be first line to load .env

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema"; // relative path to schema.ts

// DEBUG: check env variable
console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
