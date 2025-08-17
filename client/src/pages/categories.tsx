import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Settings, Tag, Search, Grid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { DocumentCategory } from '@shared/schema';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  promptTemplate: z.string().min(1, 'Prompt template is required'),
  isDefault: z.boolean().default(false),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

export default function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<DocumentCategory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'tiles'>('tiles'); // Default to tiles
  const [searchQuery, setSearchQuery] = useState('');
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Check screen size and force tiles on mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      const largeSreen = window.innerWidth >= 1024;
      setIsLargeScreen(largeSreen);
      if (!largeSreen && viewMode === 'table') {
        setViewMode('tiles');
      } else if (largeSreen && viewMode === 'tiles') {
        setViewMode('table');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [viewMode]);
  const { toast } = useToast();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      promptTemplate: '',
      isDefault: false,
    },
  });

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  const handleSort = (column: 'name' | 'createdAt' | 'status') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    
    let filtered = categories as DocumentCategory[];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((category: DocumentCategory) =>
        category.name.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query) ||
        category.promptTemplate.toLowerCase().includes(query)
      );
    }

    // Sort the filtered results
    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
        case 'status':
          aValue = a.isDefault ? 'default' : 'active';
          bValue = b.isDefault ? 'default' : 'active';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [categories, searchQuery, sortBy, sortOrder]);

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) => apiRequest('/api/categories', 'POST', JSON.stringify(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) => 
      apiRequest(`/api/categories/${id}`, 'PUT', JSON.stringify(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setDialogOpen(false);
      setEditingCategory(null);
      form.reset();
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/categories/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (category?: DocumentCategory) => {
    if (category) {
      setEditingCategory(category);
      form.reset({
        name: category.name,
        description: category.description || '',
        promptTemplate: category.promptTemplate,
        isDefault: category.isDefault,
      });
    } else {
      setEditingCategory(null);
      form.reset();
    }
    setDialogOpen(true);
  };

  const handleSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="w-full max-w-none mx-auto px-4 sm:px-6 py-4 sm:py-8" style={{ width: '90vw', maxWidth: '95vw' }}>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Categories</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage document categories and their AI analysis prompts</p>
        </div>

        {/* Search Bar, View Toggle, and Add Category */}
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              <Input
                placeholder="Search categories..."
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
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent-blue hover:bg-blue-600 whitespace-nowrap">
                    <Plus className="mr-1 sm:mr-2 h-4 w-4" />
                    <span className="text-xs sm:text-sm">Add Category</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? 'Edit Category' : 'Create New Category'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCategory 
                        ? 'Update the category details and AI analysis prompt.'
                        : 'Create a new document category with a custom AI analysis prompt.'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Supplier Management" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief description of this category" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="promptTemplate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>AI Analysis Prompt</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Act as an expert supplier manager and analyze if this document is a RFP, Offer, Contract, etc. Provide detailed analysis of..."
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isDefault"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Default Category</FormLabel>
                              <FormDescription>
                                Set this as the default category for new documents. Only one category can be default at a time.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-center justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                          className="bg-accent-blue hover:bg-blue-600"
                        >
                          {editingCategory ? 'Update Category' : 'Create Category'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No categories found' : 'No categories yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery 
                ? `No categories match "${searchQuery}". Try a different search term.`
                : 'Create your first document category to get started with AI-powered document analysis.'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => handleOpenDialog()} className="bg-accent-blue hover:bg-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                Create Category
              </Button>
            )}
          </div>
        ) : viewMode === 'table' && isLargeScreen ? (
          /* Table View */
          <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-dark-bg">
                  <TableHead 
                    className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-border select-none"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Category</span>
                      {sortBy === 'name' && (
                        <i className={`fas ${sortOrder === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs text-accent-blue`}></i>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Description</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">AI Prompt Preview</TableHead>
                  <TableHead 
                    className="font-semibold text-gray-900 dark:text-white w-24 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-border select-none"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortBy === 'status' && (
                        <i className={`fas ${sortOrder === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs text-accent-blue`}></i>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent-blue/10 rounded-lg flex items-center justify-center">
                          <Tag className="h-4 w-4 text-accent-blue" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                          {category.isDefault && (
                            <Badge variant="secondary" className="mt-1 bg-accent-green text-white text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {category.description || 'No description'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
                        {category.promptTemplate}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-accent-green border-accent-green">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.location.href = `/categories/${category.id}`}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-bg"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {!category.isDefault ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">
                            Default category cannot be deleted
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Tiles View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center">
                        <Tag className="h-5 w-5 text-accent-blue" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        {category.isDefault && (
                          <Badge variant="secondary" className="mt-1 bg-accent-green text-white">
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `/categories/${category.id}`}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-bg"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {!category.isDefault ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">
                          Protected
                        </span>
                      )}
                    </div>
                  </div>
                  {category.description && (
                    <CardDescription className="mt-2">
                      {category.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      AI Prompt Preview:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      {category.promptTemplate}
                    </p>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Created: {new Date(category.createdAt!).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}