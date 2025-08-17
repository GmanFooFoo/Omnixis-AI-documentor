import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Edit, Save, X, Plus, FileText, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

// Form validation schema
const promptFormatSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  structure: z.string().min(1, "Structure is required"),
  elements: z.string().min(1, "Elements is required"),
  bestFor: z.string().min(1, "Best for is required"),
  purpose: z.string().min(1, "Purpose is required"),
});

type PromptFormatFormData = z.infer<typeof promptFormatSchema>;

interface PromptFormat {
  id: string;
  name: string;
  description: string;
  structure: string;
  elements: string;
  bestFor: string;
  purpose: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PromptFormatsPage() {
  const [editingFormat, setEditingFormat] = useState<PromptFormat | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PromptFormatFormData>({
    resolver: zodResolver(promptFormatSchema),
    defaultValues: {
      name: "",
      description: "",
      structure: "",
      elements: "",
      bestFor: "",
      purpose: "",
    },
  });

  // Fetch prompt formats
  const { data: formats = [], isLoading } = useQuery<PromptFormat[]>({
    queryKey: ['/api/prompt-formats'],
  });

  // Create format mutation
  const createFormatMutation = useMutation({
    mutationFn: (data: PromptFormatFormData) => apiRequest('/api/prompt-formats', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompt-formats'] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "Format created",
        description: "The prompt format has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create format",
        variant: "destructive",
      });
    },
  });

  // Update format mutation
  const updateFormatMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PromptFormatFormData }) => 
      apiRequest(`/api/prompt-formats/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompt-formats'] });
      setDialogOpen(false);
      setEditingFormat(null);
      form.reset();
      toast({
        title: "Format updated",
        description: "The prompt format has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update format",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (format?: PromptFormat) => {
    if (format) {
      setEditingFormat(format);
      form.reset({
        name: format.name,
        description: format.description,
        structure: format.structure,
        elements: format.elements,
        bestFor: format.bestFor,
        purpose: format.purpose,
      });
    } else {
      setEditingFormat(null);
      form.reset();
    }
    setDialogOpen(true);
  };

  const handleSubmit = (data: PromptFormatFormData) => {
    if (editingFormat) {
      updateFormatMutation.mutate({ id: editingFormat.id, data });
    } else {
      createFormatMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Settings
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prompt Formats</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Manage structured prompt formats for AI document analysis
              </p>
            </div>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="bg-accent-blue hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Format
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-accent-blue" />
                  <span>{editingFormat ? 'Edit Format' : 'Create New Format'}</span>
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CTO" {...field} />
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
                          <Input placeholder="e.g., (Context → Task → Output)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="structure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Structure</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the format structure..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="elements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Elements</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Context, Task, Output" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bestFor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Best For</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What scenarios is this format best suited for..."
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
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What is the main purpose of this format..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createFormatMutation.isPending || updateFormatMutation.isPending}
                      className="bg-accent-blue hover:bg-blue-600"
                    >
                      {editingFormat ? 'Update Format' : 'Create Format'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Formats Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading formats...</p>
          </div>
        ) : formats.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No prompt formats yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first prompt format to get started with structured AI analysis.
            </p>
            <Button onClick={() => handleOpenDialog()} className="bg-accent-blue hover:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Create Format
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formats.sort((a, b) => a.name.localeCompare(b.name)).map((format) => (
              <Card key={format.id} className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{format.name}</CardTitle>
                          {format.isDefault && (
                            <Badge variant="secondary" className="bg-accent-green text-white text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {format.description}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(format)}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-bg"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Structure</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{format.elements}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {format.structure}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Best For</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {format.bestFor}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Purpose</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {format.purpose}
                    </p>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Created: {new Date(format.createdAt).toLocaleDateString()}
                    </p>
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