import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// Supabase connection with postgres-js (better compatibility)
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 3,
  idle_timeout: 30,
  connect_timeout: 30,
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
  connection: {
    application_name: "DocuAI",
  }
});

export const db = drizzle(client);
