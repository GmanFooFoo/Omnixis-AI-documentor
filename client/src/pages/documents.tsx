import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DocumentTypeIcon } from "@/components/LoadingAnimation";

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'tiles'>('tiles');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'createdAt' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Check screen size and force tiles on mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      const largeScreen = window.innerWidth >= 1024;
      setIsLargeScreen(largeScreen);
      if (!largeScreen && viewMode === 'table') {
        setViewMode('tiles');
      } else if (largeScreen && viewMode === 'tiles') {
        setViewMode('table');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [viewMode]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/documents"],
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      toast({
        title: "Document deleted",
        description: "Document and all related content have been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  const handleDeleteDocument = (documentId: string) => {
    deleteMutation.mutate(documentId);
  };

  const handleSelectDocument = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map((doc: any) => doc.id));
    }
  };

  const handleBulkDelete = async () => {
    for (const docId of selectedDocuments) {
      try {
        await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      } catch (error) {
        console.error(`Failed to delete document ${docId}:`, error);
      }
    }
    setSelectedDocuments([]);
    setIsSelectMode(false);
    queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    toast({
      title: "Documents deleted",
      description: `${selectedDocuments.length} documents have been removed successfully.`,
    });
  };

  const handleCancelSelection = () => {
    setSelectedDocuments([]);
    setIsSelectMode(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSort = (column: 'name' | 'size' | 'createdAt' | 'status') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredDocuments = useMemo(() => {
    if (!documents || !Array.isArray(documents)) return [];
    
    let filtered = (documents as any[]).filter((doc: any) =>
      doc.originalName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort the filtered results
    return filtered.sort((a: any, b: any) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.originalName.toLowerCase();
          bValue = b.originalName.toLowerCase();
          break;
        case 'size':
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
        case 'status':
          aValue = a.status || 'pending';
          bValue = b.status || 'pending';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [documents, searchQuery, sortBy, sortOrder]);

  const [, setLocation] = useLocation();

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="w-full max-w-none mx-auto px-4 sm:px-6 py-4 sm:py-8" style={{ width: '90vw', maxWidth: '95vw' }}>
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-600 dark:text-gray-300">Documents</span>
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Documents</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage and search your processed documents</p>
        </div>

        {/* Search Bar, View Toggle, and Bulk Actions */}
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="whitespace-nowrap hidden lg:inline-flex"
              >
                <i className="fas fa-table mr-1 sm:mr-2 text-xs sm:text-sm"></i>
                <span className="text-xs sm:text-sm">Table</span>
              </Button>
              <Button
                variant={viewMode === 'tiles' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tiles')}
                className="whitespace-nowrap"
              >
                <i className="fas fa-th-large mr-1 sm:mr-2 text-xs sm:text-sm"></i>
                <span className="text-xs sm:text-sm">Tiles</span>
              </Button>
              <Button
                variant={isSelectMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsSelectMode(!isSelectMode)}
                className="whitespace-nowrap"
              >
                <i className="fas fa-check-square mr-1 sm:mr-2 text-xs sm:text-sm"></i>
                <span className="text-xs sm:text-sm">Select</span>
              </Button>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {isSelectMode && (
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {selectedDocuments.length} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  {selectedDocuments.length === filteredDocuments.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                {selectedDocuments.length > 0 && (
                  <>
                    <Button variant="outline" size="sm" disabled className="text-gray-500">
                      <i className="fas fa-download mr-2"></i>Download {selectedDocuments.length}
                    </Button>
                    <Button variant="outline" size="sm" disabled className="text-gray-500">
                      <i className="fas fa-archive mr-2"></i>Archive {selectedDocuments.length}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <i className="fas fa-trash mr-2"></i>Delete {selectedDocuments.length}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Multiple Documents</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {selectedDocuments.length} documents? This will permanently remove all selected documents and their related content including extracted images and vector embeddings. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleBulkDelete}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete All
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={handleCancelSelection}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Documents Display */}
        <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
          <CardContent className="p-3 sm:p-6">
            {viewMode === 'table' && isLargeScreen ? (
              /* Table View */
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-dark-border">
                      {isSelectMode && (
                        <th className="text-left py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                        </th>
                      )}
                      <th 
                        className="text-left py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-border select-none"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Document</span>
                          {sortBy === 'name' && (
                            <i className={`fas ${sortOrder === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs text-accent-blue`}></i>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-border select-none"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          {sortBy === 'status' && (
                            <i className={`fas ${sortOrder === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs text-accent-blue`}></i>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-border select-none"
                        onClick={() => handleSort('size')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Size</span>
                          {sortBy === 'size' && (
                            <i className={`fas ${sortOrder === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs text-accent-blue`}></i>
                          )}
                        </div>
                      </th>
                      <th className="text-left py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">Images</th>
                      <th className="text-left py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">Vectors</th>
                      <th className="text-left py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hidden lg:table-cell">Processed</th>
                      <th className="text-left py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
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
                          {isSelectMode && (
                            <td className="py-4 px-2">
                              <input
                                type="checkbox"
                                checked={selectedDocuments.includes(doc.id)}
                                onChange={() => handleSelectDocument(doc.id)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              />
                            </td>
                          )}
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-3">
                              <DocumentTypeIcon fileName={doc.originalName || doc.fileName} size="md" className="text-blue-600" />
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
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                                    <i className="fas fa-trash mr-1"></i>Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{doc.originalName}"? This will permanently remove the document and all related content including extracted images and vector embeddings. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={deleteMutation.isPending}
                                    >
                                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={isSelectMode ? 8 : 7} className="py-8 text-center text-gray-500 dark:text-gray-400">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
                    <Card key={doc.id} className={`bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow ${
                      isSelectMode && selectedDocuments.includes(doc.id) ? 'ring-2 ring-blue-500 border-blue-500' : ''
                    }`}>
                      <CardContent className="p-6">
                        {isSelectMode && (
                          <div className="flex items-center justify-between mb-4">
                            <input
                              type="checkbox"
                              checked={selectedDocuments.includes(doc.id)}
                              onChange={() => handleSelectDocument(doc.id)}
                              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                          </div>
                        )}
                        <div className="flex items-start space-x-3 mb-4">
                          <DocumentTypeIcon fileName={doc.originalName || doc.fileName} size="lg" className="text-blue-600" />
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
                        <div className="mt-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-900">
                                <i className="fas fa-trash mr-1"></i>Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{doc.originalName}"? This will permanently remove the document and all related content including extracted images and vector embeddings. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
