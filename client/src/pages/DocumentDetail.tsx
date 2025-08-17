import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  FileText, 
  Image as ImageIcon, 
  Brain, 
  Download,
  Calendar,
  HardDrive,
  Hash,
  Eye
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Document {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  status: string;
  ocrText: string;
  imageCount: number;
  vectorCount: number;
  supabaseUrl: string;
  processingError: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ExtractedImage {
  id: string;
  documentId: string;
  fileName: string;
  supabaseUrl: string;
  annotation: string;
  pageNumber: number;
  createdAt: string;
}

interface VectorEmbedding {
  id: string;
  documentId: string;
  content: string;
  embedding: number[];
  metadata: any;
  createdAt: string;
}

export default function DocumentDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  // Fetch document details
  const { data: document, isLoading: documentLoading } = useQuery<Document>({
    queryKey: ['/api/documents', id],
    enabled: !!id,
  });

  // Fetch extracted images
  const { data: images = [], isLoading: imagesLoading } = useQuery<ExtractedImage[]>({
    queryKey: ['/api/documents', id, 'images'],
    enabled: !!id,
  });

  // Fetch vector embeddings
  const { data: vectors = [], isLoading: vectorsLoading } = useQuery<VectorEmbedding[]>({
    queryKey: ['/api/documents', id, 'vectors'],
    enabled: !!id,
  });

  if (documentLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Document Not Found</h2>
              <p className="text-muted-foreground mb-4">The document you're looking for doesn't exist.</p>
              <Button onClick={() => setLocation('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => setLocation('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{document.originalName}</h1>
            <p className="text-muted-foreground">Document Details</p>
          </div>
        </div>
        <Badge className={getStatusColor(document.status)}>
          {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
        </Badge>
      </div>

      {/* Document Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Document Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Uploaded
              </div>
              <p className="font-medium">
                {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <HardDrive className="mr-2 h-4 w-4" />
                File Size
              </div>
              <p className="font-medium">{formatFileSize(document.fileSize)}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <ImageIcon className="mr-2 h-4 w-4" />
                Images Extracted
              </div>
              <p className="font-medium">{document.imageCount}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Brain className="mr-2 h-4 w-4" />
                Vector Embeddings
              </div>
              <p className="font-medium">{document.vectorCount}</p>
            </div>
          </div>
          
          {document.processingError && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-200 text-sm">
                <strong>Processing Error:</strong> {document.processingError}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="text" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Extracted Text
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center">
            <ImageIcon className="mr-2 h-4 w-4" />
            Images ({document.imageCount})
          </TabsTrigger>
          <TabsTrigger value="vectors" className="flex items-center">
            <Brain className="mr-2 h-4 w-4" />
            Vectors ({document.vectorCount})
          </TabsTrigger>
        </TabsList>

        {/* Text Content Tab */}
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Text Content</CardTitle>
              <CardDescription>
                OCR-extracted text from the document ({document.ocrText?.length || 0} characters)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {document.ocrText ? (
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {document.ocrText}
                  </pre>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No text content extracted from this document.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Images</CardTitle>
              <CardDescription>
                Images and visual elements extracted from the document
              </CardDescription>
            </CardHeader>
            <CardContent>
              {imagesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {image.supabaseUrl?.startsWith('data:') ? (
                          <img
                            src={image.supabaseUrl}
                            alt={`Extracted image ${image.fileName}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                            <p className="text-sm">Image Preview</p>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm mb-1">{image.fileName}</h4>
                        {image.annotation && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {image.annotation}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Page {image.pageNumber || 'N/A'}</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No images were extracted from this document.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vectors Tab */}
        <TabsContent value="vectors">
          <Card>
            <CardHeader>
              <CardTitle>Vector Embeddings</CardTitle>
              <CardDescription>
                Semantic embeddings created for search and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vectorsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : vectors.length > 0 ? (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {vectors.map((vector, index) => (
                      <Card key={vector.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            Chunk {index + 1}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Hash className="mr-1 h-3 w-3" />
                            {vector.embedding?.length || 0} dimensions
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed mb-2">
                          {vector.content}
                        </p>
                        {vector.metadata && (
                          <div className="text-xs text-muted-foreground">
                            <strong>Metadata:</strong> {JSON.stringify(vector.metadata, null, 2)}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No vector embeddings were created for this document.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}