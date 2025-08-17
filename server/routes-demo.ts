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
      await storage.createProcessingQueueItem({
        documentId: document.id,
        status: "pending",
        step: "ocr",
        progress: 0
      });

      // Simulate async processing
      processDocumentAsync(document.id, file.buffer, file.mimetype);

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

  // Get user stats
  app.get('/api/stats', async (req, res) => {
    try {
      const userId = 'demo-user-123';
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Get processing queue status
  app.get('/api/processing', async (req, res) => {
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

async function processDocumentAsync(documentId: string, fileBuffer: Buffer, mimeType: string) {
  try {
    console.log(`🔄 Starting async processing for document ${documentId}`);
    
    // Update status to processing
    await storage.updateProcessingQueueItem(documentId, {
      status: "processing",
      progress: 10
    });

    // Simulate OCR processing
    console.log('📝 Performing OCR...');
    await storage.updateProcessingQueueItem(documentId, {
      progress: 30
    });

    // Simulate Mistral AI OCR (demo mode - generate mock text)
    const mockOcrText = `Demo OCR Text for ${documentId}
This is simulated text extracted from the document.
The document processing includes:
1. Automated OCR text extraction
2. Image identification and annotation
3. Vector embeddings for search
4. Secure storage in Supabase

Processing completed successfully in demo mode.`;

    // Simulate image upload
    console.log('📤 Uploading to Supabase...');
    await storage.updateProcessingQueueItem(documentId, {
      progress: 60
    });

    // Simulate vector embeddings
    console.log('🧠 Creating vector embeddings...');
    await storage.updateProcessingQueueItem(documentId, {
      progress: 90
    });

    // Complete processing
    await storage.updateDocumentStatus(documentId, "completed");
    await storage.updateProcessingQueueItem(documentId, {
      status: "completed",
      progress: 100
    });

    // Update document with results
    await storage.updateDocument(documentId, {
      ocrText: mockOcrText,
      imageCount: 2,
      vectorCount: 5,
      supabaseUrl: `https://demo-supabase-url.com/documents/${documentId}`
    });

    console.log(`✅ Document ${documentId} processed successfully`);
  } catch (error) {
    console.error(`❌ Error processing document ${documentId}:`, error);
    await storage.updateDocumentStatus(documentId, "failed", error instanceof Error ? error.message : 'Unknown error');
    await storage.updateProcessingQueueItem(documentId, {
      status: "failed",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}