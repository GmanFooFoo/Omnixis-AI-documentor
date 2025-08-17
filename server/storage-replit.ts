import {
  users,
  documents,
  extractedImages,
  vectorEmbeddings,
  processingQueue,
  documentCategories,
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
  type DocumentCategory,
  type InsertDocumentCategory,
} from "@shared/schema";
import { db } from "./db";
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
  deleteDocument(id: string): Promise<void>;

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

  // File storage operations (using PostgreSQL for everything now)
  storeDocumentFile(documentId: string, fileData: Buffer, fileName: string): Promise<string>;
  storeImageFile(documentId: string, imageData: Buffer, fileName: string): Promise<string>;
  getFileData(filePath: string): Promise<Buffer>;

  // Document categories operations
  getDocumentCategories(): Promise<DocumentCategory[]>;
  createDocumentCategory(category: InsertDocumentCategory): Promise<DocumentCategory>;
  updateDocumentCategory(id: string, updates: Partial<InsertDocumentCategory>): Promise<DocumentCategory>;
  deleteDocumentCategory(id: string): Promise<void>;
  getDocumentCategory(id: string): Promise<DocumentCategory | undefined>;
  unsetAllDefaultCategories(): Promise<void>;
}

export class ReplitDatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
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
      console.error("Error upserting user:", error);
      throw error;
    }
  }

  // Document operations
  async createDocument(documentData: InsertDocument): Promise<Document> {
    try {
      const [document] = await db
        .insert(documents)
        .values(documentData)
        .returning();
      return document;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }

  async getDocument(id: string): Promise<Document | undefined> {
    try {
      const [document] = await db.select().from(documents).where(eq(documents.id, id));
      return document;
    } catch (error) {
      console.error("Error fetching document:", error);
      return undefined;
    }
  }

  async updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document> {
    try {
      const [document] = await db
        .update(documents)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(documents.id, id))
        .returning();
      return document;
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    try {
      return await db
        .select()
        .from(documents)
        .where(eq(documents.userId, userId))
        .orderBy(desc(documents.createdAt));
    } catch (error) {
      console.error("Error fetching user documents:", error);
      return [];
    }
  }

  async updateDocumentStatus(id: string, status: string, error?: string): Promise<void> {
    try {
      await db
        .update(documents)
        .set({ 
          status, 
          processingError: error || null,
          updatedAt: new Date() 
        })
        .where(eq(documents.id, id));
    } catch (dbError) {
      console.error("Error updating document status:", dbError);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting document ${id} and all related content...`);
      
      // Delete all related data in the correct order (due to foreign key constraints)
      
      // 1. Delete processing queue items
      await db.delete(processingQueue).where(eq(processingQueue.documentId, id));
      console.log(`✓ Deleted processing queue items for document ${id}`);
      
      // 2. Delete vector embeddings
      await db.delete(vectorEmbeddings).where(eq(vectorEmbeddings.documentId, id));
      console.log(`✓ Deleted vector embeddings for document ${id}`);
      
      // 3. Delete extracted images
      await db.delete(extractedImages).where(eq(extractedImages.documentId, id));
      console.log(`✓ Deleted extracted images for document ${id}`);
      
      // 4. Finally delete the document itself
      await db.delete(documents).where(eq(documents.id, id));
      console.log(`✓ Deleted document ${id}`);
      
      console.log(`🗑️ Successfully deleted document ${id} and all related content`);
    } catch (error) {
      console.error(`❌ Error deleting document ${id}:`, error);
      throw error;
    }
  }

  // Extracted images operations
  async createExtractedImage(imageData: InsertExtractedImage): Promise<ExtractedImage> {
    try {
      const [image] = await db
        .insert(extractedImages)
        .values(imageData)
        .returning();
      return image;
    } catch (error) {
      console.error("Error creating extracted image:", error);
      throw error;
    }
  }

  async getDocumentImages(documentId: string): Promise<ExtractedImage[]> {
    try {
      return await db
        .select()
        .from(extractedImages)
        .where(eq(extractedImages.documentId, documentId));
    } catch (error) {
      console.error("Error fetching document images:", error);
      return [];
    }
  }

  // Vector embeddings operations
  async createVectorEmbedding(embeddingData: InsertVectorEmbedding): Promise<VectorEmbedding> {
    try {
      const [embedding] = await db
        .insert(vectorEmbeddings)
        .values(embeddingData)
        .returning();
      return embedding;
    } catch (error) {
      console.error("Error creating vector embedding:", error);
      throw error;
    }
  }

  async getDocumentVectors(documentId: string): Promise<VectorEmbedding[]> {
    try {
      return await db
        .select()
        .from(vectorEmbeddings)
        .where(eq(vectorEmbeddings.documentId, documentId));
    } catch (error) {
      console.error("Error fetching document vectors:", error);
      return [];
    }
  }

  // Processing queue operations
  async createProcessingQueueItem(itemData: InsertProcessingQueueItem): Promise<ProcessingQueueItem> {
    try {
      const [item] = await db
        .insert(processingQueue)
        .values(itemData)
        .returning();
      return item;
    } catch (error) {
      console.error("Error creating processing queue item:", error);
      throw error;
    }
  }

  async updateProcessingQueueItem(id: string, updates: Partial<InsertProcessingQueueItem>): Promise<ProcessingQueueItem> {
    try {
      const [item] = await db
        .update(processingQueue)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(processingQueue.id, id))
        .returning();
      return item;
    } catch (error) {
      console.error("Error updating processing queue item:", error);
      throw error;
    }
  }

  async getActiveProcessingItems(userId: string): Promise<ProcessingQueueItem[]> {
    try {
      return await db
        .select({
          id: processingQueue.id,
          status: processingQueue.status,
          progress: processingQueue.progress,
          documentId: processingQueue.documentId,
          step: processingQueue.step,
          error: processingQueue.error,
          createdAt: processingQueue.createdAt,
          updatedAt: processingQueue.updatedAt,
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
    } catch (error) {
      console.error("Error fetching active processing items:", error);
      return [];
    }
  }

  // Analytics operations
  async getUserStats(userId: string): Promise<{
    documentsProcessed: number;
    imagesExtracted: number;
    vectorEmbeddings: number;
    storageUsed: number;
  }> {
    try {
      const userDocs = await this.getUserDocuments(userId);
      
      const documentsProcessed = userDocs.filter(doc => doc.status === 'completed').length;
      const imagesExtracted = userDocs.reduce((sum, doc) => sum + (doc.imageCount || 0), 0);
      const vectorEmbeddings = userDocs.reduce((sum, doc) => sum + (doc.vectorCount || 0), 0);
      const storageUsed = userDocs.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);

      return {
        documentsProcessed,
        imagesExtracted,
        vectorEmbeddings,
        storageUsed,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return { documentsProcessed: 0, imagesExtracted: 0, vectorEmbeddings: 0, storageUsed: 0 };
    }
  }

  // File storage operations using PostgreSQL BYTEA
  async storeDocumentFile(documentId: string, fileData: Buffer, fileName: string): Promise<string> {
    try {
      // Store file as base64 in supabaseUrl field (repurposing for local storage)
      const base64Data = fileData.toString('base64');
      const filePath = `documents/${documentId}/${fileName}`;
      
      await db
        .update(documents)
        .set({ 
          supabaseUrl: `data:application/octet-stream;base64,${base64Data}`,
          updatedAt: new Date() 
        })
        .where(eq(documents.id, documentId));

      return filePath;
    } catch (error) {
      console.error("Error storing document file:", error);
      throw error;
    }
  }

  async storeImageFile(documentId: string, imageData: Buffer, fileName: string): Promise<string> {
    try {
      // Store image as base64 in supabaseUrl field for the extracted image record
      const base64Data = imageData.toString('base64');
      const filePath = `images/${documentId}/${fileName}`;
      
      // We'll store the base64 data in the supabaseUrl field for now
      const dataUrl = `data:image/jpeg;base64,${base64Data}`;
      
      return dataUrl;
    } catch (error) {
      console.error("Error storing image file:", error);
      throw error;
    }
  }

  async getFileData(filePath: string): Promise<Buffer> {
    try {
      // This would extract base64 data from the stored URL
      if (filePath.startsWith('data:')) {
        const base64Data = filePath.split(',')[1];
        return Buffer.from(base64Data, 'base64');
      }
      throw new Error('File not found');
    } catch (error) {
      console.error("Error getting file data:", error);
      throw error;
    }
  }

  // Document categories operations
  async getDocumentCategories(): Promise<DocumentCategory[]> {
    try {
      const categories = await db.select().from(documentCategories).orderBy(desc(documentCategories.createdAt));
      return categories;
    } catch (error) {
      console.error("Error fetching document categories:", error);
      throw error;
    }
  }

  async createDocumentCategory(categoryData: InsertDocumentCategory): Promise<DocumentCategory> {
    try {
      const [category] = await db
        .insert(documentCategories)
        .values(categoryData)
        .returning();
      return category;
    } catch (error) {
      console.error("Error creating document category:", error);
      throw error;
    }
  }

  async updateDocumentCategory(id: string, updates: Partial<InsertDocumentCategory>): Promise<DocumentCategory> {
    try {
      const [category] = await db
        .update(documentCategories)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(documentCategories.id, id))
        .returning();
      return category;
    } catch (error) {
      console.error("Error updating document category:", error);
      throw error;
    }
  }

  async deleteDocumentCategory(id: string): Promise<void> {
    try {
      await db.delete(documentCategories).where(eq(documentCategories.id, id));
    } catch (error) {
      console.error("Error deleting document category:", error);
      throw error;
    }
  }

  async getDocumentCategory(id: string): Promise<DocumentCategory | undefined> {
    try {
      const [category] = await db.select().from(documentCategories).where(eq(documentCategories.id, id));
      return category;
    } catch (error) {
      console.error("Error fetching document category:", error);
      return undefined;
    }
  }

  async unsetAllDefaultCategories(): Promise<void> {
    try {
      await db
        .update(documentCategories)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(eq(documentCategories.isDefault, true));
    } catch (error) {
      console.error("Error unsetting default categories:", error);
      throw error;
    }
  }
}

export const storage = new ReplitDatabaseStorage();