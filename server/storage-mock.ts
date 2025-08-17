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
import type { IStorage } from "./storage";

// Simple in-memory storage for demo mode
class MockStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private documents: Map<string, Document> = new Map();
  private extractedImages: Map<string, ExtractedImage> = new Map();
  private vectorEmbeddings: Map<string, VectorEmbedding> = new Map();
  private processingQueue: Map<string, ProcessingQueueItem> = new Map();

  constructor() {
    // Add demo user
    this.users.set('demo-user-123', {
      id: 'demo-user-123',
      email: 'demo@docuai.com',
      firstName: 'Demo',
      lastName: 'User',
      profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format&q=60',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existingUser = this.users.get(user.id!);
    const now = new Date();
    
    const newUser: User = {
      id: user.id!,
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      createdAt: existingUser?.createdAt || now,
      updatedAt: now,
    };
    
    this.users.set(user.id!, newUser);
    return newUser;
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const now = new Date();
    
    const newDocument: Document = {
      id,
      userId: document.userId,
      fileName: document.fileName,
      originalName: document.originalName,
      fileSize: document.fileSize,
      mimeType: document.mimeType,
      status: document.status || "uploaded",
      ocrText: document.ocrText || null,
      imageCount: document.imageCount || 0,
      vectorCount: document.vectorCount || 0,
      supabaseUrl: document.supabaseUrl || null,
      processingError: document.processingError || null,
      createdAt: now,
      updatedAt: now,
    };
    
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document> {
    const existing = this.documents.get(id);
    if (!existing) {
      throw new Error(`Document ${id} not found`);
    }
    
    const updated: Document = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.documents.set(id, updated);
    return updated;
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateDocumentStatus(id: string, status: string, error?: string): Promise<void> {
    const existing = this.documents.get(id);
    if (!existing) {
      throw new Error(`Document ${id} not found`);
    }
    
    const updated: Document = {
      ...existing,
      status,
      processingError: error || null,
      updatedAt: new Date(),
    };
    
    this.documents.set(id, updated);
  }

  // Extracted images operations
  async createExtractedImage(image: InsertExtractedImage): Promise<ExtractedImage> {
    const id = `img_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const newImage: ExtractedImage = {
      id,
      documentId: image.documentId,
      fileName: image.fileName,
      supabaseUrl: image.supabaseUrl,
      annotation: image.annotation || null,
      pageNumber: image.pageNumber || null,
      createdAt: new Date(),
    };
    
    this.extractedImages.set(id, newImage);
    return newImage;
  }

  async getDocumentImages(documentId: string): Promise<ExtractedImage[]> {
    return Array.from(this.extractedImages.values())
      .filter(img => img.documentId === documentId);
  }

  // Vector embeddings operations
  async createVectorEmbedding(embedding: InsertVectorEmbedding): Promise<VectorEmbedding> {
    const id = `vec_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const newEmbedding: VectorEmbedding = {
      id,
      documentId: embedding.documentId,
      content: embedding.content,
      embedding: embedding.embedding || null,
      metadata: embedding.metadata || null,
      createdAt: new Date(),
    };
    
    this.vectorEmbeddings.set(id, newEmbedding);
    return newEmbedding;
  }

  async getDocumentVectors(documentId: string): Promise<VectorEmbedding[]> {
    return Array.from(this.vectorEmbeddings.values())
      .filter(vec => vec.documentId === documentId);
  }

  // Processing queue operations
  async createProcessingQueueItem(item: InsertProcessingQueueItem): Promise<ProcessingQueueItem> {
    const id = `queue_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const now = new Date();
    
    const newItem: ProcessingQueueItem = {
      id,
      documentId: item.documentId,
      status: item.status,
      step: item.step,
      progress: item.progress || 0,
      error: item.error || null,
      createdAt: now,
      updatedAt: now,
    };
    
    this.processingQueue.set(id, newItem);
    return newItem;
  }

  async updateProcessingQueueItem(id: string, updates: Partial<InsertProcessingQueueItem>): Promise<ProcessingQueueItem> {
    const existing = this.processingQueue.get(id);
    if (!existing) {
      throw new Error(`Processing queue item ${id} not found`);
    }
    
    const updated: ProcessingQueueItem = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.processingQueue.set(id, updated);
    return updated;
  }

  async getActiveProcessingItems(userId: string): Promise<ProcessingQueueItem[]> {
    // Get user's documents first
    const userDocs = await this.getUserDocuments(userId);
    const userDocIds = new Set(userDocs.map(doc => doc.id));
    
    return Array.from(this.processingQueue.values())
      .filter(item => 
        userDocIds.has(item.documentId) && 
        item.status === "processing"
      )
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Analytics operations
  async getUserStats(userId: string): Promise<{
    documentsProcessed: number;
    imagesExtracted: number;
    vectorEmbeddings: number;
    storageUsed: number;
  }> {
    const userDocs = await this.getUserDocuments(userId);
    
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

export const mockStorage = new MockStorage();