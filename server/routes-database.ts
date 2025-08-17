import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage-simple";
import { mistralService } from "./services/mistralService";
import { supabaseService } from "./services/supabaseService";

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

export async function registerDatabaseRoutes(app: Express): Promise<Server> {
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

  // Document upload endpoint with real processing
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
        console.warn('Could not decode filename, keeping original:', originalName);
      }

      console.log(`📄 Processing file: ${originalName} (${file.size} bytes)`);

      // Create document record with proper encoding for special characters
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      // Preserve special characters (äöß) in both filenames
      const safeFileName = `${timestamp}_${randomId}_${originalName}`;
      
      const document = await storage.createDocument({
        userId,
        fileName: safeFileName,
        originalName: originalName,
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

      // Start real async processing with Mistral AI
      processDocumentAsync(document.id, queueItem.id, file.buffer, file.mimetype, originalName);

      res.json({ 
        message: "Document uploaded successfully", 
        documentId: document.id,
        status: "processing"
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

  // Get analytics stats
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

  // Get active processing items
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

  // Get document details
  app.get('/api/documents/:id', async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
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

  // Search documents using vector similarity
  app.post('/api/documents/search', async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }

      // Create embedding for the search query
      const [queryEmbedding] = await mistralService.createEmbeddings([query]);
      
      // Search similar vectors in Supabase
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

// Real document processing function with Mistral AI
async function processDocumentAsync(documentId: string, queueItemId: string, fileBuffer: Buffer, mimeType: string, originalName: string) {
  try {
    console.log(`🔄 Starting real document processing for ${documentId}`);
    
    // Update status to processing
    await storage.updateProcessingQueueItem(queueItemId, {
      status: "processing",
      progress: 10
    });

    // Step 1: OCR and Image Analysis with Mistral Document AI
    console.log('📝 Performing OCR with Mistral Document AI...');
    await storage.updateProcessingQueueItem(queueItemId, {
      progress: 30
    });

    let ocrResult;
    try {
      // Use Mistral AI for real OCR processing
      ocrResult = await mistralService.extractTextAndImages(fileBuffer, originalName);
      console.log(`✓ OCR completed: ${ocrResult.text.length} chars, ${ocrResult.images.length} images`);
      
      if (ocrResult.documentAnalysis && ocrResult.documentAnalysis.document_type) {
        console.log(`✓ Document type detected: ${ocrResult.documentAnalysis.document_type}`);
      }
    } catch (ocrError) {
      console.error(`❌ OCR failed for document ${documentId}:`, ocrError);
      throw ocrError;
    }

    // Step 2: Upload document to Supabase Storage
    console.log('📤 Uploading document to Supabase Storage...');
    await storage.updateProcessingQueueItem(queueItemId, {
      progress: 50
    });

    const fileExtension = mimeType.split('/')[1] || 'bin';
    const supabaseUrl = await supabaseService.uploadDocument(
      fileBuffer, 
      `documents/${documentId}.${fileExtension}`
    );
    console.log(`✓ Document uploaded to Supabase: ${supabaseUrl}`);

    // Step 3: Process and upload extracted images
    console.log('🖼️ Processing extracted images...');
    await storage.updateProcessingQueueItem(queueItemId, {
      progress: 60
    });

    for (let i = 0; i < ocrResult.images.length; i++) {
      const image = ocrResult.images[i];
      try {
        const imageUrl = await supabaseService.uploadImage(
          image.imageData,
          `images/${documentId}_page${image.pageNumber}_${i}.jpg`
        );
        
        // Store image metadata in database
        await storage.createExtractedImage({
          documentId,
          fileName: `image_${i}.jpg`,
          supabaseUrl: imageUrl,
          annotation: image.annotation,
          pageNumber: image.pageNumber
        });
        
        console.log(`✓ Image ${i + 1}/${ocrResult.images.length} processed`);
      } catch (imageError) {
        console.error(`❌ Failed to process image ${i}:`, imageError);
      }
    }

    // Step 4: Create vector embeddings for semantic search
    console.log('🧠 Creating vector embeddings...');
    await storage.updateProcessingQueueItem(queueItemId, {
      progress: 80
    });

    // Split text into meaningful chunks
    const textChunks = splitTextIntoChunks(ocrResult.text, 500);
    let vectorCount = 0;
    
    if (textChunks.length > 0) {
      try {
        const embeddings = await mistralService.createEmbeddings(textChunks);
        
        for (let i = 0; i < textChunks.length; i++) {
          if (embeddings[i]) {
            // Store in local database
            await storage.createVectorEmbedding({
              documentId,
              content: textChunks[i],
              embedding: embeddings[i],
              metadata: {
                chunk_index: i,
                document_type: ocrResult.documentAnalysis?.document_type || 'unknown',
                language: ocrResult.documentAnalysis?.language || 'unknown',
                processing_date: new Date().toISOString()
              }
            });
            
            // Also store in Supabase vector database for search
            await supabaseService.storeVectorEmbedding(
              embeddings[i],
              textChunks[i],
              { 
                documentId, 
                chunkIndex: i, 
                fileName: originalName,
                documentType: ocrResult.documentAnalysis?.document_type
              }
            );
            
            vectorCount++;
          }
        }
        console.log(`✓ Created ${vectorCount} vector embeddings`);
      } catch (embeddingError) {
        console.error(`❌ Failed to create embeddings:`, embeddingError);
      }
    }

    // Step 5: Complete processing
    console.log('✅ Finalizing document processing...');
    await storage.updateProcessingQueueItem(queueItemId, {
      progress: 100,
      status: "completed"
    });

    // Update document with final results
    await storage.updateDocument(documentId, {
      ocrText: ocrResult.text,
      imageCount: ocrResult.images.length,
      vectorCount: vectorCount,
      supabaseUrl: supabaseUrl,
      status: "completed"
    });

    console.log(`✅ Document ${documentId} processed successfully`);
    console.log(`   - Original filename: ${originalName}`);
    console.log(`   - Text extracted: ${ocrResult.text.length} characters`);
    console.log(`   - Images extracted: ${ocrResult.images.length}`);
    console.log(`   - Vector embeddings: ${vectorCount}`);
    console.log(`   - Document type: ${ocrResult.documentAnalysis?.document_type || 'unknown'}`);
    
  } catch (error) {
    console.error(`❌ Error processing document ${documentId}:`, error);
    
    // Update document status to failed
    await storage.updateDocumentStatus(
      documentId, 
      "failed", 
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    // Update processing queue status
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

// Helper function to split text into chunks for better embeddings
function splitTextIntoChunks(text: string, maxChunkSize: number): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = "";

  for (const word of words) {
    if ((currentChunk + " " + word).length <= maxChunkSize) {
      currentChunk += (currentChunk ? " " : "") + word;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = word;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 0);
}