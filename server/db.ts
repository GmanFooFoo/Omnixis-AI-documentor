import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// Replit PostgreSQL connection with postgres-js
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 3,
  idle_timeout: 30,
  connect_timeout: 30,
  ssl: "require",
  connection: {
    application_name: "DocuAI",
  }
});

export const db = drizzle(client, { 
  // schema: import("@shared/schema") // Import schema for relations  
});
