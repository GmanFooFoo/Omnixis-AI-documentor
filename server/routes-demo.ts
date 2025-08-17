import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { mockStorage } from "./storage-mock";
import type { IStorage } from "./storage";

// Demo routes for testing without authentication
// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
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

      // Properly decode the original filename to handle UTF-8 characters
      let originalName = file.originalname;
      try {
        // Try to decode the filename if it's been encoded incorrectly
        if (originalName.includes('Ã')) {
          // Convert from Latin-1 to UTF-8 to fix encoding issues
          const buffer = Buffer.from(originalName, 'latin1');
          originalName = buffer.toString('utf8');
        }
      } catch (e) {
        // If decoding fails, keep the original name
        console.warn('Could not decode filename, keeping original:', originalName);
      }

      console.log(`📄 Processing file: ${originalName} (${file.size} bytes)`);

      // Create document record with proper encoding for special characters
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      // Preserve special characters (äöß) in both filenames
      const safeFileName = `${timestamp}_${randomId}_${originalName}`;
      
      const document = await mockStorage.createDocument({
        userId,
        fileName: safeFileName,
        originalName: originalName, // Keep original with special characters properly decoded
        fileSize: file.size,
        mimeType: file.mimetype,
        status: "uploaded"
      });

      // Start processing queue
      const queueItem = await mockStorage.createProcessingQueueItem({
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
      const documents = await mockStorage.getUserDocuments(userId);
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
      const stats = await mockStorage.getUserStats(userId);
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
      const activeItems = await mockStorage.getActiveProcessingItems(userId);
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
      const images = await mockStorage.getDocumentImages(documentId);
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
    await mockStorage.updateProcessingQueueItem(queueItemId, {
      status: "processing",
      progress: 10
    });

    // Step 1: Simulate OCR processing
    console.log('📝 Simulating OCR processing...');
    await mockStorage.updateProcessingQueueItem(queueItemId, {
      progress: 30
    });

    // Step 2: Simulate text extraction
    await mockStorage.updateProcessingQueueItem(queueItemId, {
      progress: 50
    });

    const simulatedOcrText = `This is simulated OCR text from the document.
Document contains special characters like äöß which are preserved.
Processing completed successfully in demo mode.`;

    // Step 3: Simulate image processing
    await mockStorage.updateProcessingQueueItem(queueItemId, {
      progress: 70
    });

    // Step 4: Complete processing
    console.log('✅ Finalizing document processing...');
    await mockStorage.updateProcessingQueueItem(queueItemId, {
      progress: 100,
      status: "completed"
    });

    await mockStorage.updateDocumentStatus(documentId, "completed");

    // Update document with final results
    await mockStorage.updateDocument(documentId, {
      ocrText: simulatedOcrText,
      imageCount: 0,
      vectorCount: 3,
      supabaseUrl: `https://demo.storage.url/${documentId}`
    });

    console.log(`✅ Document ${documentId} processed successfully in demo mode`);
    console.log(`   - Text extracted: ${simulatedOcrText.length} characters`);
    console.log(`   - Images processed: 0`);
    console.log(`   - Vector embeddings: 3`);
    
  } catch (error) {
    console.error(`❌ Error processing document ${documentId}:`, error);
    await mockStorage.updateDocumentStatus(documentId, "failed", error instanceof Error ? error.message : 'Unknown error');
    try {
      await mockStorage.updateProcessingQueueItem(queueItemId, {
        status: "failed",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } catch (updateError) {
      console.error('Failed to update processing queue item:', updateError);
    }
  }
}