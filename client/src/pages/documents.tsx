import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'tiles'>('table');

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

        {/* Search Bar and View Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <i className="fas fa-table mr-2"></i>Table
            </Button>
            <Button
              variant={viewMode === 'tiles' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('tiles')}
            >
              <i className="fas fa-th-large mr-2"></i>Tiles
            </Button>
          </div>
        </div>

        {/* Documents Display */}
        <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
          <CardContent className="p-6">
            {viewMode === 'table' ? (
              /* Table View */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-dark-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Document</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Size</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Images</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Vectors</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Processed</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center">
                          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </td>
                      </tr>
                    ) : filteredDocuments.length > 0 ? (
                      filteredDocuments.map((doc: any) => (
                        <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-3">
                              <i className={`fas ${doc.mimeType?.includes('pdf') ? 'fa-file-pdf text-red-500' : 
                                             doc.mimeType?.includes('word') ? 'fa-file-word text-blue-500' : 
                                             'fa-file-image text-green-500'} text-lg`}></i>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.originalName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{doc.mimeType}</p>
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
                          <td className="py-4 px-2 text-sm text-gray-900 dark:text-white">{formatBytes(doc.fileSize)}</td>
                          <td className="py-4 px-2 text-sm text-gray-900 dark:text-white">{doc.imageCount || 0}</td>
                          <td className="py-4 px-2 text-sm text-gray-900 dark:text-white">{doc.vectorCount || 0}</td>
                          <td className="py-4 px-2 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-2">
                              <Link href={`/documents/${doc.id}`}>
                                <Button variant="ghost" size="sm" className="text-accent-blue hover:text-blue-600">
                                  <i className="fas fa-eye mr-1"></i>View
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <i className="fas fa-download mr-1"></i>Download
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400">
                          <i className="fas fa-file-text text-2xl mb-2"></i>
                          <p>{searchQuery ? 'No documents found' : 'No documents yet'}</p>
                          <p className="text-sm">{searchQuery ? 'Try adjusting your search terms' : 'Upload your first document to get started'}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Tiles View */
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
                          <Link href={`/documents/${doc.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              <i className="fas fa-eye mr-1"></i>View
                            </Button>
                          </Link>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
