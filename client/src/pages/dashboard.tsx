import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch user statistics
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
    retry: false,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
      }
    },
  });

  // Fetch active processing items
  const { data: activeProcessing = [], isLoading: processingLoading } = useQuery({
    queryKey: ["/api/processing/active"],
    retry: false,
    refetchInterval: 2000, // Refresh every 2 seconds for real-time updates
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
      }
    },
  });

  // Fetch recent documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents"],
    retry: false,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Automated OCR & Document Processing</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <i className="fas fa-download mr-2"></i>Export Data
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Documents Processed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statsLoading ? "..." : formatNumber((stats as any)?.documentsProcessed || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-text text-accent-blue"></i>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Images Extracted</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statsLoading ? "..." : formatNumber((stats as any)?.imagesExtracted || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-image text-accent-green"></i>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Vector Embeddings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statsLoading ? "..." : formatNumber((stats as any)?.vectorEmbeddings || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-vector-square text-purple-500"></i>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Storage Used</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statsLoading ? "..." : formatBytes((stats as any)?.storageUsed || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent-orange/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-database text-accent-orange"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* File Upload Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Document Processing</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mistral AI Connected</span>
                  </div>
                </div>

                <FileUpload />

                {/* Processing Workflow */}
                <div className="mt-8">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Processing Workflow</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                      <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-white">OCR & Image Annotation</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Mistral AI extracts text and identifies images</p>
                      </div>
                      <i className="fas fa-eye text-accent-blue"></i>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                      <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-white">Secure Image Storage</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Images stored in Supabase with unique naming</p>
                      </div>
                      <i className="fas fa-shield-alt text-accent-green"></i>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-white">Vectorization & Storage</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Embeddings created and stored in Vector Database</p>
                      </div>
                      <i className="fas fa-brain text-purple-500"></i>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monitoring Panel */}
          <div className="space-y-6">
            {/* Active Processing */}
            <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Processing</h3>
                  <Badge variant="secondary">
                    {processingLoading ? "..." : `${(activeProcessing as any[])?.length || 0} items`}
                  </Badge>
                </div>

                <div className="space-y-3 min-h-[120px] flex flex-col">
                  {processingLoading ? (
                    <div className="text-center py-4 flex-1 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : (activeProcessing as any[])?.length > 0 ? (
                    <div className="flex-1">
                      {(activeProcessing as any[]).map((item: any) => (
                        <div key={item.id} className="p-3 bg-gray-50 dark:bg-dark-bg rounded-lg mb-3 last:mb-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {item.originalName || item.fileName}
                            </span>
                            <Badge 
                              variant={item.step === 'ocr' ? 'default' : item.step === 'storage' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {item.step === 'ocr' ? 'OCR' : item.step === 'storage' ? 'Storage' : 'Vectorizing'}
                            </Badge>
                          </div>
                          <Progress value={item.progress || 0} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>
                              {item.step === 'ocr' ? 'Extracting text...' : 
                               item.step === 'storage' ? 'Storing images...' : 
                               'Creating vectors...'}
                            </span>
                            <span>{item.progress || 0}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <i className="fas fa-clock text-2xl mb-2"></i>
                      <p className="text-sm">No active processing</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-accent-green rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Mistral AI OCR</span>
                    </div>
                    <Badge variant="default" className="bg-accent-green text-white">Operational</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-accent-green rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Supabase Storage</span>
                    </div>
                    <Badge variant="default" className="bg-accent-green text-white">Operational</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-accent-green rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Vector Database</span>
                    </div>
                    <Badge variant="default" className="bg-accent-green text-white">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="mt-8">
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Documents</h3>
                <Button variant="ghost" className="text-accent-blue hover:text-blue-600">
                  View All
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-dark-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Document</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Images</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Vectors</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Processed</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                    {documentsLoading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center">
                          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </td>
                      </tr>
                    ) : (documents as any[])?.length > 0 ? (
                      (documents as any[]).slice(0, 5).map((doc: any) => (
                        <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-3">
                              <i className={`fas ${doc.mimeType?.includes('pdf') ? 'fa-file-pdf text-red-500' : 
                                           doc.mimeType?.includes('word') ? 'fa-file-word text-blue-500' : 
                                           'fa-file-image text-green-500'}`}></i>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.originalName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(doc.fileSize)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <Badge 
                              variant={doc.status === 'completed' ? 'default' : 
                                     doc.status === 'processing' ? 'secondary' : 
                                     doc.status === 'failed' ? 'destructive' : 'outline'}
                              className={doc.status === 'completed' ? 'bg-accent-green text-white' :
                                        doc.status === 'processing' ? 'bg-accent-orange text-white' : ''}
                            >
                              {doc.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-2 text-sm text-gray-900 dark:text-white">{doc.imageCount || 0}</td>
                          <td className="py-4 px-2 text-sm text-gray-900 dark:text-white">{doc.vectorCount || 0}</td>
                          <td className="py-4 px-2 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="text-accent-blue hover:text-blue-600">
                                View
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                Download
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                          <i className="fas fa-file-text text-2xl mb-2"></i>
                          <p>No documents processed yet</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
