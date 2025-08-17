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
import { Brain, Key, Plus, Settings, Trash2, Eye, EyeOff, Star, CheckCircle, ArrowLeft, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filter models based on search
  const filteredUserConfigs = userConfigs.filter(config =>
    config.model.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    config.provider.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableModels = availableModels.filter(model =>
    model.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.provider.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Breadcrumb */}
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Settings
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">LLM Models</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configure your AI language models and API keys for document processing
            </p>
          </div>
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
                    {filteredAvailableModels.map((model) => (
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-accent-blue" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Configured Models</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{userConfigs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-green/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-accent-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Models</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {userConfigs.filter(c => c.isEnabled).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-orange/10 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-accent-orange" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available Models</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{availableModels.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configured Models List */}
        {filteredUserConfigs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Configured Models</h2>
            <div className="space-y-3">
              {filteredUserConfigs.map((config) => (
                <Card key={config.id} className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center">
                          <Brain className="h-6 w-6 text-accent-blue" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {config.model.displayName}
                            </h3>
                            {config.isPrimary && (
                              <Badge className="bg-accent-green text-white">
                                <Star className="mr-1 h-3 w-3" />
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{config.provider.displayName}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">API Key:</span>
                              {config.hasApiKey ? (
                                <CheckCircle className="h-4 w-4 text-accent-green" />
                              ) : (
                                <span className="text-red-500 text-sm">Missing</span>
                              )}
                            </div>
                            {config.model.costPer1kTokens && (
                              <div className="flex items-center space-x-1">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Cost:</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  ${config.model.costPer1kTokens}/1k tokens
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Enabled</span>
                          <Switch
                            checked={config.isEnabled}
                            onCheckedChange={() => handleToggleEnabled(config)}
                            disabled={updateConfigMutation.isPending}
                          />
                        </div>

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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Models */}
        {filteredAvailableModels.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Available Models ({filteredAvailableModels.length})
            </h2>
            <div className="space-y-3">
              {filteredAvailableModels.map((model) => (
                <Card key={model.id} className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <Brain className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {model.displayName}
                            </h3>
                            <Badge variant="outline">
                              {model.provider.displayName}
                            </Badge>
                          </div>
                          {model.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {model.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4">
                            {model.costPer1kTokens && (
                              <div className="flex items-center space-x-1">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Cost:</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  ${model.costPer1kTokens}/1k tokens
                                </span>
                              </div>
                            )}
                            {model.maxTokens && (
                              <div className="flex items-center space-x-1">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Max Tokens:</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {model.maxTokens.toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => openConfigDialog(model)}
                        className="bg-accent-blue hover:bg-blue-600"
                      >
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {userConfigs.length === 0 && availableModels.length === 0 && !configsLoading && !modelsLoading && (
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardContent className="p-12 text-center">
              <Brain className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No LLM Models Available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No language models are currently available for configuration.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {(configsLoading || modelsLoading) && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                    </div>
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