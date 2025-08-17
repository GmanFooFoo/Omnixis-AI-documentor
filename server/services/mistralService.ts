import fetch from "node-fetch";

export class MistralService {
  private apiKey: string;
  private baseUrl = "https://api.mistral.ai/v1";

  constructor() {
    this.apiKey = process.env.MISTRAL_API_KEY || process.env.MISTRAL_API_KEY_ENV_VAR || "default_key";
  }

  async extractTextAndImages(fileBuffer: Buffer, fileName: string): Promise<{
    text: string;
    images: Array<{
      pageNumber: number;
      annotation: string;
      imageData: Buffer;
    }>;
  }> {
    try {
      // Convert file to base64 for Mistral API
      const base64Data = fileBuffer.toString('base64');
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Please extract all text from this document and identify any images. For each image, provide a detailed annotation describing what you see. Return the response in JSON format with 'text' field for extracted text and 'images' array with objects containing 'pageNumber', 'annotation', and 'bounds' for each image."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${this.getMimeType(fileName)};base64,${base64Data}`
                  }
                }
              ]
            }
          ],
          max_tokens: 4000,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json() as any;
      const content = result.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error("No content received from Mistral API");
      }

      // Parse the JSON response from Mistral
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch {
        // If not JSON, treat as plain text
        parsedContent = { text: content, images: [] };
      }

      // For demo purposes, we'll simulate image extraction
      // In a real implementation, you'd need to use specialized OCR tools
      // or a document processing service that can extract actual images
      const mockImages = [];
      if (parsedContent.images && Array.isArray(parsedContent.images)) {
        for (const img of parsedContent.images) {
          mockImages.push({
            pageNumber: img.pageNumber || 1,
            annotation: img.annotation || "Image detected in document",
            imageData: Buffer.from("placeholder-image-data", 'utf8') // Placeholder
          });
        }
      }

      return {
        text: parsedContent.text || content,
        images: mockImages
      };
    } catch (error) {
      console.error("Mistral OCR error:", error);
      throw new Error(`Failed to extract text and images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "mistral-embed",
          input: texts,
        })
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json() as any;
      return result.data.map((item: any) => item.embedding);
    } catch (error) {
      console.error("Mistral embeddings error:", error);
      throw new Error(`Failed to create embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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

export const mistralService = new MistralService();
