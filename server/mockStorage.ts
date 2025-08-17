import {
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
import { IStorage } from "./storage";

// Mock storage for testing when database is unavailable
export class MockStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private documents: Map<string, Document> = new Map();
  private extractedImages: Map<string, ExtractedImage> = new Map();
  private vectorEmbeddings: Map<string, VectorEmbedding> = new Map();
  private processingQueue: Map<string, ProcessingQueueItem> = new Map();

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id!,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id!, user);
    return user;
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = Math.random().toString(36).substring(2, 15);
    const newDoc: Document = {
      id,
      ...document,
      status: document.status || "uploaded",
      ocrText: document.ocrText ?? null,
      imageCount: document.imageCount ?? 0,
      vectorCount: document.vectorCount ?? 0,
      supabaseUrl: document.supabaseUrl ?? null,
      processingError: document.processingError ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.set(id, newDoc);
    return newDoc;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document> {
    const doc = this.documents.get(id);
    if (!doc) throw new Error("Document not found");
    
    const updated = { ...doc, ...updates, updatedAt: new Date() };
    this.documents.set(id, updated);
    return updated;
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.userId === userId);
  }

  async updateDocumentStatus(id: string, status: string, error?: string): Promise<void> {
    const doc = this.documents.get(id);
    if (doc) {
      const updated = { ...doc, status, updatedAt: new Date() };
      if (error) updated.processingError = error;
      this.documents.set(id, updated);
    }
  }

  // Extracted images operations
  async createExtractedImage(image: InsertExtractedImage): Promise<ExtractedImage> {
    const id = Math.random().toString(36).substring(2, 15);
    const newImage: ExtractedImage = {
      id,
      ...image,
      annotation: image.annotation ?? null,
      pageNumber: image.pageNumber ?? null,
      createdAt: new Date(),
    };
    this.extractedImages.set(id, newImage);
    return newImage;
  }

  async getDocumentImages(documentId: string): Promise<ExtractedImage[]> {
    return Array.from(this.extractedImages.values()).filter(img => img.documentId === documentId);
  }

  // Vector embeddings operations
  async createVectorEmbedding(embedding: InsertVectorEmbedding): Promise<VectorEmbedding> {
    const id = Math.random().toString(36).substring(2, 15);
    const newEmbedding: VectorEmbedding = {
      id,
      ...embedding,
      embedding: embedding.embedding ?? null,
      metadata: embedding.metadata ?? {},
      createdAt: new Date(),
    };
    this.vectorEmbeddings.set(id, newEmbedding);
    return newEmbedding;
  }

  async getDocumentVectors(documentId: string): Promise<VectorEmbedding[]> {
    return Array.from(this.vectorEmbeddings.values()).filter(vec => vec.documentId === documentId);
  }

  // Processing queue operations
  async createProcessingQueueItem(item: InsertProcessingQueueItem): Promise<ProcessingQueueItem> {
    const id = Math.random().toString(36).substring(2, 15);
    const newItem: ProcessingQueueItem = {
      id,
      ...item,
      progress: item.progress ?? null,
      error: item.error ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.processingQueue.set(id, newItem);
    return newItem;
  }

  async updateProcessingQueueItem(id: string, updates: Partial<InsertProcessingQueueItem>): Promise<ProcessingQueueItem> {
    const item = this.processingQueue.get(id);
    if (!item) throw new Error("Processing queue item not found");
    
    const updated = { ...item, ...updates, updatedAt: new Date() };
    this.processingQueue.set(id, updated);
    return updated;
  }

  async getActiveProcessingItems(userId: string): Promise<ProcessingQueueItem[]> {
    const userDocs = Array.from(this.documents.values()).filter(doc => doc.userId === userId);
    const userDocIds = new Set(userDocs.map(doc => doc.id));
    
    return Array.from(this.processingQueue.values())
      .filter(item => userDocIds.has(item.documentId) && item.status === "processing")
      .map(item => {
        const doc = this.documents.get(item.documentId);
        return {
          ...item,
          fileName: doc?.fileName || '',
          originalName: doc?.originalName || '',
        } as any;
      });
  }

  // Analytics operations
  async getUserStats(userId: string): Promise<{
    documentsProcessed: number;
    imagesExtracted: number;
    vectorEmbeddings: number;
    storageUsed: number;
  }> {
    const userDocs = Array.from(this.documents.values()).filter(doc => doc.userId === userId);
    
    return {
      documentsProcessed: userDocs.filter(doc => doc.status === "completed").length,
      imagesExtracted: userDocs.reduce((sum, doc) => sum + (doc.imageCount || 0), 0),
      vectorEmbeddings: userDocs.reduce((sum, doc) => sum + (doc.vectorCount || 0), 0),
      storageUsed: userDocs.reduce((sum, doc) => sum + doc.fileSize, 0),
    };
  }
}