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
import { LoadingAnimation, ProcessingSteps, DocumentTypeIcon } from "@/components/LoadingAnimation";

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
  });

  // Fetch active processing items
  const { data: activeProcessing = [], isLoading: processingLoading } = useQuery({
    queryKey: ["/api/processing/active"],
    retry: false,
    refetchInterval: 2000, // Refresh every 2 seconds for real-time updates
  });

  // Fetch recent documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents"],
    retry: false,
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
                    <div className="text-center py-8">
                      <LoadingAnimation fileName="Loading..." status="processing" size="md" showProgress={false} />
                    </div>
                  ) : (activeProcessing as any[])?.length > 0 ? (
                    <div className="space-y-6">
                      {(activeProcessing as any[]).map((item: any) => {
                        const document = (documents as any[]).find((doc: any) => doc.id === item.documentId);
                        const fileName = document?.originalName || document?.fileName || "Document";
                        
                        return (
                          <div key={item.id} className="border border-gray-200 dark:border-dark-border rounded-lg p-6">
                            {/* Document Header with Icon */}
                            <div className="flex items-center space-x-3 mb-4">
                              <DocumentTypeIcon fileName={fileName} size="lg" className="text-blue-600 dark:text-blue-400" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">{fileName}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {document?.fileSize ? `${Math.round(document.fileSize / 1024)} KB` : ''}
                                </p>
                              </div>
                              <Badge variant="secondary" className="bg-accent-blue text-white">
                                {item.step || "Processing"}
                              </Badge>
                            </div>

                            {/* Animated Loading Animation */}
                            <div className="mb-6">
                              <LoadingAnimation 
                                fileName={fileName}
                                status={item.step || "processing"}
                                progress={item.progress || 0}
                                size="md"
                                showProgress={true}
                              />
                            </div>

                            {/* Processing Steps */}
                            <ProcessingSteps 
                              currentStep={item.step || "upload"}
                              progress={item.progress || 0}
                            />

                            {/* Error Display */}
                            {item.error && (
                              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  <i className="fas fa-exclamation-triangle mr-2"></i>
                                  {item.error}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-check text-2xl text-accent-green"></i>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">No active processing</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Upload a document to get started</p>
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
                              <DocumentTypeIcon fileName={doc.originalName || doc.fileName} size="md" className="text-blue-600" />
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
