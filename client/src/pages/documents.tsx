import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/documents"],
    retry: false,
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents?.filter((doc: any) =>
    doc.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Documents</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage and search your processed documents</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc: any) => (
              <Card key={doc.id} className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <i className={`fas ${doc.mimeType?.includes('pdf') ? 'fa-file-pdf text-red-500' : 
                                   doc.mimeType?.includes('word') ? 'fa-file-word text-blue-500' : 
                                   'fa-file-image text-green-500'} text-2xl`}></i>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                        {doc.originalName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatBytes(doc.fileSize)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant={doc.status === 'completed' ? 'default' : 
                             doc.status === 'processing' ? 'secondary' : 
                             doc.status === 'failed' ? 'destructive' : 'outline'}
                      className={doc.status === 'completed' ? 'bg-accent-green text-white' :
                                doc.status === 'processing' ? 'bg-accent-orange text-white' : ''}
                    >
                      {doc.status}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Images:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {doc.imageCount || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Vectors:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {doc.vectorCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <i className="fas fa-eye mr-1"></i>View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <i className="fas fa-download mr-1"></i>Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No documents found' : 'No documents yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
