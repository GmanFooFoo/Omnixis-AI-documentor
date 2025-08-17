import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { mistralService } from "./services/mistralService";
import { supabaseService } from "./services/supabaseService";

// Demo routes for testing without authentication
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

export async function registerDemoRoutes(app: Express): Promise<Server> {
  // Demo user endpoint (no auth required)
  app.get('/api/auth/user', async (req, res) => {
    // Return a demo user for testing
    const demoUser = {
      id: 'demo-user-123',
      email: 'demo@docuai.com',
      firstName: 'Demo',
      lastName: 'User',
      profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format&q=60',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    res.json(demoUser);
  });

  // Demo login endpoint
  app.get('/api/login', (req, res) => {
    res.redirect('/');
  });

  // Demo logout endpoint
  app.get('/api/logout', (req, res) => {
    res.redirect('/');
  });

  // Document upload endpoint (demo mode)
  app.post('/api/documents/upload', upload.single('document'), async (req, res) => {
    try {
      const userId = 'demo-user-123';
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log(`📄 Processing file: ${file.originalname} (${file.size} bytes)`);

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
      const queueItem = await storage.createProcessingQueueItem({
        documentId: document.id,
        status: "pending",
        step: "ocr",
        progress: 0
      });

      // Simulate async processing
      processDocumentAsync(document.id, queueItem.id, file.buffer, file.mimetype);

      res.json({ 
        message: "Document uploaded successfully", 
        documentId: document.id,
        status: "processing"
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // Get user documents
  app.get('/api/documents', async (req, res) => {
    try {
      const userId = 'demo-user-123';
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Get analytics stats (matching the frontend route)
  app.get('/api/analytics/stats', async (req, res) => {
    try {
      const userId = 'demo-user-123';
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Get active processing items (matching the frontend route)
  app.get('/api/processing/active', async (req, res) => {
    try {
      const userId = 'demo-user-123';
      const activeItems = await storage.getActiveProcessingItems(userId);
      res.json(activeItems);
    } catch (error) {
      console.error("Error fetching processing items:", error);
      res.status(500).json({ message: "Failed to fetch processing items" });
    }
  });

  // Get document images
  app.get('/api/documents/:id/images', async (req, res) => {
    try {
      const documentId = req.params.id;
      const images = await storage.getDocumentImages(documentId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching document images:", error);
      res.status(500).json({ message: "Failed to fetch document images" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function processDocumentAsync(documentId: string, queueItemId: string, fileBuffer: Buffer, mimeType: string) {
  try {
    console.log(`🔄 Starting async processing for document ${documentId}`);
    
    // Update status to processing
    await storage.updateProcessingQueueItem(queueItemId, {
      status: "processing",
      progress: 10
    });

    // Step 1: Mistral AI OCR with Document AI annotations
    console.log('📝 Performing OCR with Mistral Document AI...');
    await storage.updateProcessingQueueItem(queueItemId, {
      progress: 30
    });

    let ocrResult;
    try {
      ocrResult = await mistralService.extractTextAndImages(fileBuffer, `document_${documentId}`);
      console.log(`✓ OCR completed: ${ocrResult.text.length} chars, ${ocrResult.images.length} images`);
      if (ocrResult.documentAnalysis && ocrResult.documentAnalysis.document_type) {
        console.log(`✓ Document type: ${ocrResult.documentAnalysis.document_type}`);
      }
    } catch (ocrError) {
      console.error(`❌ OCR failed for document ${documentId}:`, ocrError);
      throw ocrError;
    }

    // Step 2: Upload document to Supabase
    console.log('📤 Uploading to Supabase...');
    await storage.updateProcessingQueueItem(queueItemId, {
      progress: 50
    });

    const supabaseUrl = await supabaseService.uploadDocument(
      fileBuffer, 
      `document_${documentId}.${mimeType.split('/')[1]}`
    );
    console.log(`✓ Document uploaded to Supabase: ${supabaseUrl}`);

    // Step 3: Upload extracted images to Supabase
    await storage.updateProcessingQueueItem(queueItemId, {
      progress: 60
    });

    for (let i = 0; i < ocrResult.images.length; i++) {
      const image = ocrResult.images[i];
      const imageUrl = await supabaseService.uploadImage(
        image.imageData,
        `${documentId}_page${image.pageNumber}_${i}.jpg`
      );
      
      // Store image metadata
      await storage.createExtractedImage({
        documentId,
        fileName: `image_${i}.jpg`,
        supabaseUrl: imageUrl,
        annotation: image.annotation,
        pageNumber: image.pageNumber
      });
    }

    // Step 4: Create vector embeddings
    console.log('🧠 Creating vector embeddings...');
    await storage.updateProcessingQueueItem(queueItemId, {
      progress: 80
    });

    const textChunks = ocrResult.text.split('\n\n').filter(chunk => chunk.trim().length > 0);
    if (textChunks.length > 0) {
      const embeddings = await mistralService.createEmbeddings(textChunks);
      
      for (let i = 0; i < textChunks.length; i++) {
        await storage.createVectorEmbedding({
          documentId,
          content: textChunks[i],
          embedding: embeddings[i] || null,
          metadata: {
            chunk_index: i,
            document_type: ocrResult.documentAnalysis.document_type,
            language: ocrResult.documentAnalysis.language
          }
        });
      }
    }

    // Step 5: Complete processing
    console.log('✅ Finalizing document processing...');
    await storage.updateProcessingQueueItem(queueItemId, {
      progress: 100,
      status: "completed"
    });

    await storage.updateDocumentStatus(documentId, "completed");

    // Update document with final results
    await storage.updateDocument(documentId, {
      ocrText: ocrResult.text,
      imageCount: ocrResult.images.length,
      vectorCount: textChunks.length,
      supabaseUrl: supabaseUrl
    });

    console.log(`✅ Document ${documentId} processed successfully with Mistral AI Document AI`);
    console.log(`   - Text extracted: ${ocrResult.text.length} characters`);
    console.log(`   - Images annotated: ${ocrResult.images.length}`);
    console.log(`   - Vector embeddings: ${textChunks.length}`);
    
  } catch (error) {
    console.error(`❌ Error processing document ${documentId}:`, error);
    await storage.updateDocumentStatus(documentId, "failed", error instanceof Error ? error.message : 'Unknown error');
    try {
      await storage.updateProcessingQueueItem(queueItemId, {
        status: "failed",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } catch (updateError) {
      console.error('Failed to update processing queue item:', updateError);
    }
  }
}