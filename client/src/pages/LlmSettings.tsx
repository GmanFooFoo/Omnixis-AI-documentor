import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'wouter';
import { Brain, Key, Plus, Settings, Trash2, Eye, EyeOff, Star, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LlmModel {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  maxTokens?: number;
  costPer1kTokens?: number;
  provider: {
    id: string;
    name: string;
    displayName: string;
  };
}

interface UserLlmConfig {
  id: string;
  isEnabled: boolean;
  isPrimary: boolean;
  hasApiKey: boolean;
  model: LlmModel;
  provider: {
    id: string;
    name: string;
    displayName: string;
  };
  createdAt: string;
  updatedAt: string;
}

const configFormSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  isEnabled: z.boolean().default(true),
  isPrimary: z.boolean().default(false),
});

type ConfigFormData = z.infer<typeof configFormSchema>;

export default function LlmSettings() {
  const [selectedModel, setSelectedModel] = useState<LlmModel | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  const form = useForm<ConfigFormData>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      apiKey: '',
      isEnabled: true,
      isPrimary: false,
    },
  });

  // Fetch available models
  const { data: models = [], isLoading: modelsLoading } = useQuery<LlmModel[]>({
    queryKey: ['/api/llm/models'],
  });

  // Fetch user configurations
  const { data: userConfigs = [], isLoading: configsLoading } = useQuery<UserLlmConfig[]>({
    queryKey: ['/api/llm/user-configs'],
  });

  // Create/update configuration mutation
  const createConfigMutation = useMutation({
    mutationFn: (data: ConfigFormData & { providerId: string; modelId: string }) =>
      apiRequest('POST', '/api/llm/user-configs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/llm/user-configs'] });
      setIsConfigDialogOpen(false);
      form.reset();
      toast({
        title: "Configuration saved",
        description: "LLM configuration has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save configuration",
        variant: "destructive",
      });
    },
  });

  // Update configuration mutation
  const updateConfigMutation = useMutation({
    mutationFn: ({ configId, data }: { configId: string; data: Partial<ConfigFormData> }) =>
      apiRequest('PUT', `/api/llm/user-configs/${configId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/llm/user-configs'] });
      toast({
        title: "Configuration updated",
        description: "LLM configuration has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update configuration",
        variant: "destructive",
      });
    },
  });

  // Delete configuration mutation
  const deleteConfigMutation = useMutation({
    mutationFn: (configId: string) =>
      apiRequest('DELETE', `/api/llm/user-configs/${configId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/llm/user-configs'] });
      toast({
        title: "Configuration deleted",
        description: "LLM configuration has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete configuration",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ConfigFormData) => {
    if (!selectedModel) return;

    createConfigMutation.mutate({
      ...data,
      providerId: selectedModel.provider.id,
      modelId: selectedModel.id,
    });
  };

  const handleToggleEnabled = (config: UserLlmConfig) => {
    updateConfigMutation.mutate({
      configId: config.id,
      data: { isEnabled: !config.isEnabled },
    });
  };

  const handleSetPrimary = (config: UserLlmConfig) => {
    updateConfigMutation.mutate({
      configId: config.id,
      data: { isPrimary: true },
    });
  };

  const handleDeleteConfig = (configId: string) => {
    deleteConfigMutation.mutate(configId);
  };

  const openConfigDialog = (model: LlmModel) => {
    setSelectedModel(model);
    form.reset();
    setIsConfigDialogOpen(true);
  };

  const configuredModelIds = new Set(userConfigs.map(config => config.model.id));
  const availableModels = models.filter(model => !configuredModelIds.has(model.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-accent-blue">Home</Link>
          <span>/</span>
          <Link href="/settings" className="hover:text-accent-blue">Settings</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300">LLM Configuration</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">LLM Configuration</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Configure your AI language models and API keys for document processing.
          </p>
        </div>

        {/* Configured Models */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Configured Models</h2>
            <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent-blue hover:bg-blue-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Model
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Configure LLM Model</DialogTitle>
                </DialogHeader>
                
                {/* Model Selection */}
                <div className="space-y-4">
                  <div>
                    <Label>Select Model</Label>
                    <div className="grid gap-2 mt-2 max-h-60 overflow-y-auto">
                      {availableModels.map((model) => (
                        <Card
                          key={model.id}
                          className={`cursor-pointer transition-colors ${
                            selectedModel?.id === model.id
                              ? 'border-accent-blue bg-accent-blue/5'
                              : 'hover:bg-gray-50 dark:hover:bg-dark-bg'
                          }`}
                          onClick={() => setSelectedModel(model)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{model.displayName}</p>
                                <p className="text-xs text-gray-500">{model.provider.displayName}</p>
                              </div>
                              <div className="text-right">
                                {model.costPer1kTokens && (
                                  <p className="text-xs text-gray-500">
                                    ${model.costPer1kTokens}/1k tokens
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {selectedModel && (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="apiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Key</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showApiKey ? "text" : "password"}
                                    placeholder="Enter your API key"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                  >
                                    {showApiKey ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="isPrimary"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>Set as Primary Model</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsConfigDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={createConfigMutation.isPending}
                            className="bg-accent-blue hover:bg-blue-600"
                          >
                            {createConfigMutation.isPending ? 'Saving...' : 'Save Configuration'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {configsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : userConfigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userConfigs.map((config) => (
                <Card key={config.id} className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center">
                          <Brain className="h-5 w-5 text-accent-blue" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {config.model.displayName}
                          </h3>
                          <p className="text-sm text-gray-500">{config.provider.displayName}</p>
                        </div>
                      </div>
                      {config.isPrimary && (
                        <Badge className="bg-accent-green text-white">
                          <Star className="mr-1 h-3 w-3" />
                          Primary
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">API Key</span>
                        <div className="flex items-center space-x-2">
                          {config.hasApiKey ? (
                            <CheckCircle className="h-4 w-4 text-accent-green" />
                          ) : (
                            <span className="text-red-500 text-sm">Missing</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                        <Switch
                          checked={config.isEnabled}
                          onCheckedChange={() => handleToggleEnabled(config)}
                          disabled={updateConfigMutation.isPending}
                        />
                      </div>

                      {config.model.costPer1kTokens && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Cost</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            ${config.model.costPer1kTokens}/1k tokens
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-dark-border">
                      <div className="flex space-x-2">
                        {!config.isPrimary && config.isEnabled && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetPrimary(config)}
                            disabled={updateConfigMutation.isPending}
                          >
                            Set Primary
                          </Button>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteConfig(config.id)}
                        disabled={deleteConfigMutation.isPending}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
              <CardContent className="p-12 text-center">
                <Brain className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No LLM Models Configured
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Configure your first AI language model to start processing documents.
                </p>
                <Button
                  onClick={() => setIsConfigDialogOpen(true)}
                  className="bg-accent-blue hover:bg-blue-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Model
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Available Models Info */}
        {availableModels.length > 0 && (
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Available Models ({availableModels.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableModels.map((model) => (
                  <div
                    key={model.id}
                    className="p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {model.displayName}
                      </h4>
                      <Badge variant="outline">
                        {model.provider.displayName}
                      </Badge>
                    </div>
                    {model.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {model.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {model.costPer1kTokens && (
                        <span className="text-sm text-gray-500">
                          ${model.costPer1kTokens}/1k tokens
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openConfigDialog(model)}
                      >
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}