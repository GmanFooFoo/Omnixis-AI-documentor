import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  real,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Documents table for storing uploaded document metadata
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fileName: varchar("file_name").notNull(),
  originalName: varchar("original_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type").notNull(),
  status: varchar("status").notNull().default("uploaded"), // uploaded, processing, completed, failed
  ocrText: text("ocr_text"),
  imageCount: integer("image_count").default(0),
  vectorCount: integer("vector_count").default(0),
  supabaseUrl: varchar("supabase_url"),
  processingError: text("processing_error"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Extracted images table for storing image metadata
export const extractedImages = pgTable("extracted_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").notNull().references(() => documents.id),
  fileName: varchar("file_name").notNull(),
  supabaseUrl: varchar("supabase_url").notNull(),
  annotation: text("annotation"),
  pageNumber: integer("page_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vector embeddings table for storing document vectors
export const vectorEmbeddings = pgTable("vector_embeddings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").notNull().references(() => documents.id),
  content: text("content").notNull(),
  embedding: real("embedding").array(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Processing queue for tracking document processing status
export const processingQueue = pgTable("processing_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").notNull().references(() => documents.id),
  status: varchar("status").notNull(), // pending, processing, completed, failed
  step: varchar("step").notNull(), // ocr, storage, vectorization
  progress: integer("progress").default(0),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

export type ExtractedImage = typeof extractedImages.$inferSelect;
export type InsertExtractedImage = typeof extractedImages.$inferInsert;

export type VectorEmbedding = typeof vectorEmbeddings.$inferSelect;
export type InsertVectorEmbedding = typeof vectorEmbeddings.$inferInsert;

export type ProcessingQueueItem = typeof processingQueue.$inferSelect;
export type InsertProcessingQueueItem = typeof processingQueue.$inferInsert;

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExtractedImageSchema = createInsertSchema(extractedImages).omit({
  id: true,
  createdAt: true,
});

export const insertVectorEmbeddingSchema = createInsertSchema(vectorEmbeddings).omit({
  id: true,
  createdAt: true,
});

export const insertProcessingQueueItemSchema = createInsertSchema(processingQueue).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
