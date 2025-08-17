import { createClient } from '@supabase/supabase-js';

export class SupabaseService {
  private supabase: any;
  private bucketName = 'DocuAI';

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_URL_ENV_VAR || "default_url";
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY_ENV_VAR || "default_key";
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadImage(imageData: Buffer, fileName: string): Promise<string> {
    try {
      // Generate unique filename with timestamp and random string
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const uniqueFileName = `${timestamp}_${randomString}_${fileName}`;

      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(uniqueFileName, imageData, {
          contentType: this.getMimeType(fileName),
          upsert: false
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(uniqueFileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadDocument(documentData: Buffer, fileName: string): Promise<string> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const uniqueFileName = `documents/${timestamp}_${randomString}_${fileName}`;

      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(uniqueFileName, documentData, {
          contentType: this.getMimeType(fileName),
          upsert: false
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(uniqueFileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Supabase document upload error:", error);
      throw new Error(`Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async storeVectorEmbedding(embedding: number[], content: string, metadata: any): Promise<void> {
    // Vector embeddings are now stored in the local PostgreSQL database via the storage layer
    // This method is kept for compatibility but doesn't perform any additional storage
    console.log('Vector embedding will be stored in local database');
  }

  async searchSimilarVectors(queryEmbedding: number[], limit: number = 10): Promise<any[]> {
    // Vector search will be performed using local database
    // This method is kept for compatibility but returns empty results for now
    console.log('Vector search would be performed in local database');
    return [];
  }

  private getMimeType(fileName: string): string {
    const ext = fileName.toLowerCase().split('.').pop();
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'tiff':
        return 'image/tiff';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return 'application/octet-stream';
    }
  }
}

export const supabaseService = new SupabaseService();
