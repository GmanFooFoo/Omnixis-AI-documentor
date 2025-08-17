import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Tag, Edit, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { DocumentCategory } from '@shared/schema';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  promptTemplate: z.string().min(1, 'Prompt template is required'),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

export default function CategoryDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      promptTemplate: '',
      isDefault: false,
      isActive: true,
    },
  });

  // Fetch category details
  const { data: category, isLoading } = useQuery<DocumentCategory>({
    queryKey: ['/api/categories', id],
    enabled: !!id,
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) => 
      apiRequest(`/api/categories/${id}`, 'PUT', JSON.stringify(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories', id] });
      setIsEditing(false);
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

  // Set form values when category data loads
  React.useEffect(() => {
    if (category && typeof category === 'object' && 'name' in category) {
      form.reset({
        name: category.name,
        description: category.description || '',
        promptTemplate: category.promptTemplate,
        isDefault: category.isDefault,
        isActive: category.isActive,
      });
    }
  }, [category, form]);

  const handleSubmit = (data: CategoryFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Form errors:', form.formState.errors);
    updateCategoryMutation.mutate(data);
  };

  const handleCancel = () => {
    if (category && typeof category === 'object' && 'name' in category) {
      form.reset({
        name: category.name,
        description: category.description || '',
        promptTemplate: category.promptTemplate,
        isDefault: category.isDefault,
        isActive: category.isActive,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading category...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!category || typeof category !== 'object' || !('name' in category)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Category not found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The category you're looking for doesn't exist or may have been deleted.
            </p>
            <Button onClick={() => setLocation('/categories')} className="bg-accent-blue hover:bg-blue-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/categories')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-600 dark:text-gray-300">{(category as DocumentCategory).name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-accent-blue" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {(category as DocumentCategory).name}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                {(category as DocumentCategory).isDefault && (
                  <Badge variant="secondary" className="bg-accent-green text-white">
                    Default Category
                  </Badge>
                )}
                <Badge variant="outline" className="text-accent-green border-accent-green">
                  Active
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateCategoryMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="category-edit-form"
                  disabled={updateCategoryMutation.isPending}
                  className="bg-accent-blue hover:bg-blue-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateCategoryMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-accent-blue hover:bg-blue-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Category
              </Button>
            )}
          </div>
        </div>

        {/* Category Details */}
        <Form {...form}>
          <form id="category-edit-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Large Prompt Editor */}
              <div className="lg:col-span-2">
                <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <i className="fab fa-markdown text-accent-blue"></i>
                      <span>AI Analysis Prompt</span>
                    </CardTitle>
                    <CardDescription>
                      Create detailed prompts using Markdown formatting. This prompt will guide the AI analysis for documents in this category.
                    </CardDescription>
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <i className="fab fa-markdown text-blue-600 dark:text-blue-400"></i>
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Markdown Formatting</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-800 dark:text-blue-200">
                        <div><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded"># Heading</code></div>
                        <div><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">**bold**</code></div>
                        <div><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">*italic*</code></div>
                        <div><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">- list</code></div>
                        <div><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">## Sub</code></div>
                        <div><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">`code`</code></div>
                        <div><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">1. number</code></div>
                        <div><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{'> quote'}</code></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="promptTemplate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                placeholder={`# AI Analysis Instructions

Act as an expert **supplier manager** and analyze this document thoroughly.

## Analysis Requirements:
1. **Document Type**: Identify if this is a RFP, Offer, Contract, Invoice, etc.
2. **Key Information**: Extract important dates, amounts, parties involved
3. **Risk Assessment**: Highlight any potential risks or concerns
4. **Recommendations**: Provide actionable recommendations

## Output Format:
- Use clear headings and bullet points
- Include relevant quotes from the document
- Highlight critical information in **bold**

Please provide detailed analysis with specific insights relevant to supplier management.`}
                                className="min-h-[600px] font-mono text-sm resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Use the Markdown formatting shown above to create structured, professional prompts.
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
                          {(category as DocumentCategory).promptTemplate}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Category Settings */}
              <div className="lg:col-span-1 space-y-6">
                {/* Category Settings Card */}
                <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <i className="fas fa-cog text-accent-blue"></i>
                      <span>Category Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-6">
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
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Brief description of this category and its purpose"
                                  className="min-h-[80px]"
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
                                <CardDescription className="text-xs">
                                  Default for new documents
                                </CardDescription>
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

                        <FormField
                          control={form.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Active Category</FormLabel>
                                <CardDescription className="text-xs">
                                  Available for selection
                                </CardDescription>
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
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category Name</label>
                          <p className="text-gray-900 dark:text-white font-medium">{(category as DocumentCategory).name}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                          <p className="text-gray-900 dark:text-white">
                            {(category as DocumentCategory).description || 'No description provided'}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                          {(category as DocumentCategory).isDefault && (
                            <Badge variant="secondary" className="bg-accent-green text-white text-xs">
                              Default
                            </Badge>
                          )}
                          {(category as DocumentCategory).isActive ? (
                            <Badge variant="outline" className="border-green-500 text-green-600 text-xs">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-500 text-red-600 text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>



                {/* Metadata Card */}
                <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                      Metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Status</span>
                      {(category as DocumentCategory).isActive ? (
                        <Badge variant="outline" className="border-green-500 text-green-600 text-xs">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-red-500 text-red-600 text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Type</span>
                      <Badge variant={(category as DocumentCategory).isDefault ? "default" : "outline"} 
                             className={(category as DocumentCategory).isDefault ? "bg-accent-green text-white text-xs" : "text-xs"}>
                        {(category as DocumentCategory).isDefault ? 'Default' : 'Custom'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Created</span>
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date((category as DocumentCategory).createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {(category as DocumentCategory).updatedAt && (category as DocumentCategory).updatedAt !== (category as DocumentCategory).createdAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Updated</span>
                        <div className="flex items-center text-gray-900 dark:text-white">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date((category as DocumentCategory).updatedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Usage Statistics Card (placeholder for future) */}
                <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                      Usage Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <Tag className="h-6 w-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Usage stats coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}