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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Tag, Edit, Calendar, Info, BarChart3 } from 'lucide-react';
import { Link } from 'wouter';
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
    mutationFn: (data: CategoryFormData) => {
      console.log('Making API request to:', `/api/categories/${id}`);
      return apiRequest('PUT', `/api/categories/${id}`, data);
    },
    onSuccess: (response) => {
      console.log('Update successful:', response);
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories', id] });
      setIsEditing(false);
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Update error:', error);
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
    console.log('Submitting to category ID:', id);
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
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-accent-blue">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-accent-blue">Categories</Link>
          <span>/</span>
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
                    <CardTitle className="font-semibold tracking-tight flex items-center justify-between text-[16px]">
                      <div className="flex items-center space-x-2">
                        <i className="fab fa-markdown text-accent-blue"></i>
                        <span>AI Analysis Prompt</span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <Info className="h-4 w-4 mr-1" />
                            Markdown Help
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <i className="fab fa-markdown text-accent-blue"></i>
                              <span>Markdown Formatting Guide</span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Use these Markdown formatting options to create structured, professional prompts:
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm"># Heading</code>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Large heading</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">## Subheading</code>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Medium heading</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">**bold text**</code>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Bold text</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">*italic text*</code>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Italic text</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">- List item</code>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Bullet point</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">1. Numbered</code>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Numbered list</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">`inline code`</code>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Inline code</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">{'> Quote'}</code>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Block quote</span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                    <CardDescription>
                      Create detailed prompts using Markdown formatting. This prompt will guide the AI analysis for documents in this category.
                    </CardDescription>
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
                                placeholder={`# Document Analysis Framework

Act as an expert document analyst and provide comprehensive analysis of this document.

## Core Analysis Areas:

### 1. Document Classification & Context
- **Document Type**: Classify the document (contract, invoice, report, manual, etc.)
- **Business Context**: Identify the industry/domain and purpose
- **Stakeholders**: List all parties, roles, and relationships mentioned
- **Timeline**: Extract all dates, deadlines, and time-sensitive information

### 2. Key Information Extraction
- **Critical Data Points**: Numbers, amounts, quantities, percentages
- **Decisions & Actions**: Required actions, approvals, next steps
- **Compliance & Requirements**: Standards, regulations, certifications mentioned
- **Contact Information**: People, departments, external organizations

### 3. Content Structure Analysis
- **Main Topics**: Identify primary themes and subject areas
- **Supporting Details**: Evidence, examples, references provided
- **Quality Assessment**: Completeness, clarity, professional standards
- **Dependencies**: Requirements, prerequisites, linked documents

### 4. Business Intelligence
- **Opportunities**: Potential benefits, improvements, optimizations
- **Risks & Concerns**: Issues, gaps, potential problems identified
- **Strategic Insights**: Broader implications and recommendations
- **Follow-up Actions**: Suggested next steps and monitoring points

## Output Requirements:
- Structure with clear markdown headings and bullet points
- Quote relevant passages to support findings
- Highlight **critical information** and *important details*
- Provide actionable recommendations with priority levels
- Include confidence levels for key assessments

Focus on practical, actionable insights that enable informed decision-making.`}
                                className="min-h-[600px] font-mono text-sm resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Use Markdown formatting to create structured, professional prompts. Click "Markdown Help" above for syntax reference.
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
                      <span className="text-[16px]">Category Settings</span>
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
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base">Category Type</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="default-yes"
                                      name="isDefault"
                                      value="true"
                                      checked={field.value === true}
                                      onChange={() => field.onChange(true)}
                                      className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="default-yes" className="text-sm font-medium text-gray-900 dark:text-white">
                                      Default Category
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="default-no"
                                      name="isDefault"
                                      value="false"
                                      checked={field.value === false}
                                      onChange={() => field.onChange(false)}
                                      className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="default-no" className="text-sm font-medium text-gray-900 dark:text-white">
                                      Custom Category
                                    </label>
                                  </div>
                                </div>
                              </FormControl>
                              <CardDescription className="text-xs">
                                Default categories are automatically assigned to new documents
                              </CardDescription>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base">Category Status</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="active-yes"
                                      name="isActive"
                                      value="true"
                                      checked={field.value === true}
                                      onChange={() => field.onChange(true)}
                                      className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="active-yes" className="text-sm font-medium text-gray-900 dark:text-white">
                                      Active
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      id="active-no"
                                      name="isActive"
                                      value="false"
                                      checked={field.value === false}
                                      onChange={() => field.onChange(false)}
                                      className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="active-no" className="text-sm font-medium text-gray-900 dark:text-white">
                                      Inactive
                                    </label>
                                  </div>
                                </div>
                              </FormControl>
                              <CardDescription className="text-xs">
                                Active categories are available for document selection
                              </CardDescription>
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

                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</span>
                          <Badge variant={(category as DocumentCategory).isDefault ? "default" : "outline"} 
                                 className={(category as DocumentCategory).isDefault ? "bg-accent-green text-white text-xs" : "text-xs"}>
                            {(category as DocumentCategory).isDefault ? 'Default' : 'Custom'}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
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

                {/* Usage Statistics Card */}
                <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <BarChart3 className="h-4 w-4" />
                      <span>Usage Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
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
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="text-center">
                        <Tag className="h-4 w-4 text-gray-300 dark:text-gray-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Document usage stats coming soon
                        </p>
                      </div>
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