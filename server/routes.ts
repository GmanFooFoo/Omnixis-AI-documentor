import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { mistralService } from "./services/mistralService";
import { supabaseService } from "./services/supabaseService";
import { insertDocumentSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/tiff'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error('Unsupported file type') as any;
      cb(error, false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Document upload endpoint
  app.post('/api/documents/upload', isAuthenticated, upload.single('document'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Create document record
      const document = await storage.createDocument({
        userId,
        fileName: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${file.originalname}`,
        originalName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: "uploaded"
      });

      // Start processing queue
      await storage.createProcessingQueueItem({
        documentId: document.id,
        status: "pending",
        step: "ocr",
        progress: 0
      });

      // Start async processing
      processDocumentAsync(document.id, file.buffer, file.originalname);

      res.json({ 
        message: "Document uploaded successfully", 
        documentId: document.id 
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ 
        message: "Failed to upload document",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get user documents
  app.get('/api/documents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Get document details
  app.get('/api/documents/:id', isAuthenticated, async (req: any, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Check if user owns the document
      const userId = req.user.claims.sub;
      if (document.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  // Get active processing items
  app.get('/api/processing/active', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activeItems = await storage.getActiveProcessingItems(userId);
      res.json(activeItems);
    } catch (error) {
      console.error("Error fetching processing items:", error);
      res.status(500).json({ message: "Failed to fetch processing items" });
    }
  });

  // Get user statistics
  app.get('/api/analytics/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Search documents using vector similarity
  app.post('/api/documents/search', isAuthenticated, async (req: any, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }

      // Create embedding for the search query
      const [queryEmbedding] = await mistralService.createEmbeddings([query]);
      
      // Search similar vectors
      const results = await supabaseService.searchSimilarVectors(queryEmbedding);
      
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Failed to search documents" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Async document processing function
async function processDocumentAsync(documentId: string, fileBuffer: Buffer, fileName: string) {
  let processingQueueItem: any = null;
  
  try {
    console.log(`🔄 Starting async processing for document ${documentId}`);
    
    // Update status to processing
    await storage.updateDocumentStatus(documentId, "processing");
    
    // Step 1: OCR and Image Annotation
    processingQueueItem = await storage.createProcessingQueueItem({
      documentId,
      status: "processing",
      step: "ocr",
      progress: 10
    });

    console.log('📝 Performing OCR with Mistral Document AI...');
    let ocrResult;
    try {
      ocrResult = await mistralService.extractTextAndImages(fileBuffer, fileName);
      console.log(`✓ OCR completed: ${ocrResult.text.length} chars, ${ocrResult.images.length} images`);
    } catch (ocrError) {
      console.error(`❌ OCR failed for document ${documentId}:`, ocrError);
      throw ocrError;
    }
    
    // Update document with OCR text
    await storage.updateDocument(documentId, {
      ocrText: ocrResult.text,
      imageCount: ocrResult.images.length
    });

    // Step 2: Store images in Supabase
    console.log('📤 Uploading extracted images to Supabase...');
    await storage.updateProcessingQueueItem(processingQueueItem.id, {
      step: "storage",
      progress: 40
    });

    const imageUrls = [];
    for (const [index, image] of ocrResult.images.entries()) {
      const imageUrl = await supabaseService.uploadImage(
        image.imageData, 
        `image_${index}_${fileName}`
      );
      
      await storage.createExtractedImage({
        documentId,
        fileName: `image_${index}_${fileName}`,
        supabaseUrl: imageUrl,
        annotation: image.annotation,
        pageNumber: image.pageNumber
      });
      
      imageUrls.push(imageUrl);
    }

    // Step 3: Create embeddings and store in vector database
    console.log('🧠 Creating vector embeddings...');
    await storage.updateProcessingQueueItem(processingQueueItem.id, {
      step: "vectorization",
      progress: 70
    });

    // Split text into chunks for better embeddings
    const textChunks = splitTextIntoChunks(ocrResult.text, 500);
    const embeddings = await mistralService.createEmbeddings(textChunks);

    let vectorCount = 0;
    for (const [index, embedding] of embeddings.entries()) {
      await storage.createVectorEmbedding({
        documentId,
        content: textChunks[index],
        embedding,
        metadata: { 
          chunkIndex: index,
          fileName,
          processingDate: new Date().toISOString()
        }
      });
      
      // Also store in Supabase vector database
      await supabaseService.storeVectorEmbedding(
        embedding,
        textChunks[index],
        { documentId, chunkIndex: index, fileName }
      );
      
      vectorCount++;
    }

    // Update document with final status
    await storage.updateDocument(documentId, {
      vectorCount,
      status: "completed"
    });

    // Mark processing as completed
    console.log(`✅ Document ${documentId} processed successfully`);
    console.log(`   - Text extracted: ${ocrResult.text.length} characters`);
    console.log(`   - Images extracted: ${ocrResult.images.length}`);
    console.log(`   - Vector embeddings: ${vectorCount}`);
    
    await storage.updateProcessingQueueItem(processingQueueItem.id, {
      status: "completed",
      progress: 100
    });

  } catch (error) {
    console.error(`❌ Error processing document ${documentId}:`, error);
    
    // Update document with error status
    await storage.updateDocumentStatus(
      documentId, 
      "failed", 
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    // Mark processing as failed
    if (processingQueueItem) {
      try {
        await storage.updateProcessingQueueItem(processingQueueItem.id, {
          status: "failed",
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } catch (updateError) {
        console.error('Failed to update processing queue item:', updateError);
      }
    }
  }
}

// Helper function to split text into chunks
function splitTextIntoChunks(text: string, maxChunkSize: number): string[] {
  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = "";

  for (const word of words) {
    if ((currentChunk + " " + word).length <= maxChunkSize) {
      currentChunk += (currentChunk ? " " : "") + word;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = word;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}
