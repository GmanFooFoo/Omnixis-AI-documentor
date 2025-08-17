import {
  users,
  documents,
  extractedImages,
  vectorEmbeddings,
  processingQueue,
  type User,
  type UpsertUser,
  type Document,
  type InsertDocument,
  type ExtractedImage,
  type InsertExtractedImage,
  type VectorEmbedding,
  type InsertVectorEmbedding,
  type ProcessingQueueItem,
  type InsertProcessingQueueItem,
} from "@shared/schema";
import { db } from "./db";
import { createClient } from '@supabase/supabase-js';
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: string): Promise<Document | undefined>;
  updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document>;
  getUserDocuments(userId: string): Promise<Document[]>;
  updateDocumentStatus(id: string, status: string, error?: string): Promise<void>;

  // Extracted images operations
  createExtractedImage(image: InsertExtractedImage): Promise<ExtractedImage>;
  getDocumentImages(documentId: string): Promise<ExtractedImage[]>;

  // Vector embeddings operations
  createVectorEmbedding(embedding: InsertVectorEmbedding): Promise<VectorEmbedding>;
  getDocumentVectors(documentId: string): Promise<VectorEmbedding[]>;

  // Processing queue operations
  createProcessingQueueItem(item: InsertProcessingQueueItem): Promise<ProcessingQueueItem>;
  updateProcessingQueueItem(id: string, updates: Partial<InsertProcessingQueueItem>): Promise<ProcessingQueueItem>;
  getActiveProcessingItems(userId: string): Promise<ProcessingQueueItem[]>;

  // Analytics operations
  getUserStats(userId: string): Promise<{
    documentsProcessed: number;
    imagesExtracted: number;
    vectorEmbeddings: number;
    storageUsed: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  private supabase: any;

  constructor() {
    // Fallback to Supabase REST API if direct DB connection fails
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    try {
      // Try Drizzle first, fallback to Supabase REST API
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.log('Using Supabase REST API for getUser');
      const { data, error: supabaseError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (supabaseError && supabaseError.code !== 'PGRST116') {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }
      
      return data || undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      // Try Drizzle first, fallback to Supabase REST API
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (error) {
      console.log('Using Supabase REST API for upsertUser');
      const { data, error: supabaseError } = await this.supabase
        .from('users')
        .upsert({
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }
      
      return data;
    }
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db.insert(documents).values(document).returning();
    return newDocument;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document> {
    const [document] = await db
      .update(documents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return document;
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.createdAt));
  }

  async updateDocumentStatus(id: string, status: string, error?: string): Promise<void> {
    await db
      .update(documents)
      .set({ 
        status, 
        processingError: error,
        updatedAt: new Date() 
      })
      .where(eq(documents.id, id));
  }

  // Extracted images operations
  async createExtractedImage(image: InsertExtractedImage): Promise<ExtractedImage> {
    const [newImage] = await db.insert(extractedImages).values(image).returning();
    return newImage;
  }

  async getDocumentImages(documentId: string): Promise<ExtractedImage[]> {
    return await db
      .select()
      .from(extractedImages)
      .where(eq(extractedImages.documentId, documentId));
  }

  // Vector embeddings operations
  async createVectorEmbedding(embedding: InsertVectorEmbedding): Promise<VectorEmbedding> {
    const [newEmbedding] = await db.insert(vectorEmbeddings).values(embedding).returning();
    return newEmbedding;
  }

  async getDocumentVectors(documentId: string): Promise<VectorEmbedding[]> {
    return await db
      .select()
      .from(vectorEmbeddings)
      .where(eq(vectorEmbeddings.documentId, documentId));
  }

  // Processing queue operations
  async createProcessingQueueItem(item: InsertProcessingQueueItem): Promise<ProcessingQueueItem> {
    const [newItem] = await db.insert(processingQueue).values(item).returning();
    return newItem;
  }

  async updateProcessingQueueItem(id: string, updates: Partial<InsertProcessingQueueItem>): Promise<ProcessingQueueItem> {
    const [item] = await db
      .update(processingQueue)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(processingQueue.id, id))
      .returning();
    return item;
  }

  async getActiveProcessingItems(userId: string): Promise<ProcessingQueueItem[]> {
    return await db
      .select({
        id: processingQueue.id,
        documentId: processingQueue.documentId,
        status: processingQueue.status,
        step: processingQueue.step,
        progress: processingQueue.progress,
        error: processingQueue.error,
        createdAt: processingQueue.createdAt,
        updatedAt: processingQueue.updatedAt,
        fileName: documents.fileName,
        originalName: documents.originalName,
      })
      .from(processingQueue)
      .innerJoin(documents, eq(processingQueue.documentId, documents.id))
      .where(
        and(
          eq(documents.userId, userId),
          eq(processingQueue.status, "processing")
        )
      )
      .orderBy(desc(processingQueue.createdAt));
  }

  // Analytics operations
  async getUserStats(userId: string): Promise<{
    documentsProcessed: number;
    imagesExtracted: number;
    vectorEmbeddings: number;
    storageUsed: number;
  }> {
    const userDocs = await db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId));

    const documentsProcessed = userDocs.filter(doc => doc.status === "completed").length;
    const imagesExtracted = userDocs.reduce((sum, doc) => sum + (doc.imageCount || 0), 0);
    const vectorEmbeddings = userDocs.reduce((sum, doc) => sum + (doc.vectorCount || 0), 0);
    const storageUsed = userDocs.reduce((sum, doc) => sum + doc.fileSize, 0);

    return {
      documentsProcessed,
      imagesExtracted,
      vectorEmbeddings,
      storageUsed,
    };
  }
}

import { MockStorage } from "./mockStorage";

// Use MockStorage for testing when database is unavailable
console.log('⚠ Using MockStorage for testing (database connection issues)');
export const storage: IStorage = new MockStorage();
