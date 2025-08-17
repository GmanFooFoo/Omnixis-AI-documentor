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

export class SimpleStorage implements IStorage {
  private documents: Map<string, Document> = new Map();
  private users: Map<string, User> = new Map();
  private images: Map<string, ExtractedImage[]> = new Map();
  private vectors: Map<string, VectorEmbedding[]> = new Map();
  private processingQueue: Map<string, ProcessingQueueItem> = new Map();

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id!,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Document operations
  async createDocument(documentData: InsertDocument): Promise<Document> {
    const id = Math.random().toString(36).substring(2, 15);
    const document: Document = {
      id,
      fileName: documentData.fileName,
      status: documentData.status || "uploaded",
      userId: documentData.userId,
      originalName: documentData.originalName,
      fileSize: documentData.fileSize,
      mimeType: documentData.mimeType,
      ocrText: documentData.ocrText || null,
      imageCount: documentData.imageCount || null,
      vectorCount: documentData.vectorCount || null,
      supabaseUrl: documentData.supabaseUrl || null,
      processingError: documentData.processingError || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document> {
    const existing = this.documents.get(id);
    if (!existing) {
      throw new Error('Document not found');
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
    const document = this.documents.get(id);
    if (document) {
      document.status = status;
      if (error) {
        document.processingError = error;
      }
      document.updatedAt = new Date();
      this.documents.set(id, document);
    }
  }

  // Extracted images operations
  async createExtractedImage(imageData: InsertExtractedImage): Promise<ExtractedImage> {
    const id = Math.random().toString(36).substring(2, 15);
    const image: ExtractedImage = {
      id,
      fileName: imageData.fileName,
      supabaseUrl: imageData.supabaseUrl,
      documentId: imageData.documentId,
      annotation: imageData.annotation || null,
      pageNumber: imageData.pageNumber || null,
      createdAt: new Date(),
    };
    
    const documentImages = this.images.get(imageData.documentId) || [];
    documentImages.push(image);
    this.images.set(imageData.documentId, documentImages);
    
    return image;
  }

  async getDocumentImages(documentId: string): Promise<ExtractedImage[]> {
    return this.images.get(documentId) || [];
  }

  // Vector embeddings operations
  async createVectorEmbedding(embeddingData: InsertVectorEmbedding): Promise<VectorEmbedding> {
    const id = Math.random().toString(36).substring(2, 15);
    const embedding: VectorEmbedding = {
      id,
      embedding: embeddingData.embedding || null,
      metadata: embeddingData.metadata,
      content: embeddingData.content,
      documentId: embeddingData.documentId,
      createdAt: new Date(),
    };
    
    const documentVectors = this.vectors.get(embeddingData.documentId) || [];
    documentVectors.push(embedding);
    this.vectors.set(embeddingData.documentId, documentVectors);
    
    return embedding;
  }

  async getDocumentVectors(documentId: string): Promise<VectorEmbedding[]> {
    return this.vectors.get(documentId) || [];
  }

  // Processing queue operations
  async createProcessingQueueItem(itemData: InsertProcessingQueueItem): Promise<ProcessingQueueItem> {
    const id = Math.random().toString(36).substring(2, 15);
    const item: ProcessingQueueItem = {
      id,
      status: itemData.status,
      progress: itemData.progress || null,
      documentId: itemData.documentId,
      step: itemData.step,
      error: itemData.error || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.processingQueue.set(id, item);
    return item;
  }

  async updateProcessingQueueItem(id: string, updates: Partial<InsertProcessingQueueItem>): Promise<ProcessingQueueItem> {
    const existing = this.processingQueue.get(id);
    if (!existing) {
      throw new Error('Processing queue item not found');
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
    return Array.from(this.processingQueue.values())
      .filter(item => {
        const document = this.documents.get(item.documentId);
        return document && document.userId === userId && item.status === 'processing';
      })
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
  }
}

export const storage = new SimpleStorage();