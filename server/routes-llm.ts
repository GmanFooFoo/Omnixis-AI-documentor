import { Router } from "express";
import { db } from "./db";
import { llmProviders, llmModels, userLlmConfigs } from "@shared/schema";
import { insertUserLlmConfigSchema } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export const llmRouter = Router();

// Get all available LLM providers and models
llmRouter.get("/providers", async (req, res) => {
  try {
    const providers = await db
      .select()
      .from(llmProviders)
      .where(eq(llmProviders.isActive, true));
    
    res.json(providers);
  } catch (error) {
    console.error("Error fetching LLM providers:", error);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
});

// Get all available models for a provider
llmRouter.get("/providers/:providerId/models", async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const models = await db
      .select()
      .from(llmModels)
      .where(and(
        eq(llmModels.providerId, providerId),
        eq(llmModels.isActive, true)
      ));
    
    res.json(models);
  } catch (error) {
    console.error("Error fetching LLM models:", error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

// Get all models across all providers
llmRouter.get("/models", async (req, res) => {
  try {
    const models = await db
      .select({
        id: llmModels.id,
        name: llmModels.name,
        displayName: llmModels.displayName,
        description: llmModels.description,
        maxTokens: llmModels.maxTokens,
        costPer1kTokens: llmModels.costPer1kTokens,
        provider: {
          id: llmProviders.id,
          name: llmProviders.name,
          displayName: llmProviders.displayName,
        }
      })
      .from(llmModels)
      .innerJoin(llmProviders, eq(llmModels.providerId, llmProviders.id))
      .where(and(
        eq(llmModels.isActive, true),
        eq(llmProviders.isActive, true)
      ));
    
    res.json(models);
  } catch (error) {
    console.error("Error fetching LLM models:", error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

// Get user's LLM configurations
llmRouter.get("/user-configs", async (req, res) => {
  try {
    const userId = (req as any).user?.id || "demo-user-123";
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const configs = await db
      .select({
        id: userLlmConfigs.id,
        isEnabled: userLlmConfigs.isEnabled,
        isPrimary: userLlmConfigs.isPrimary,
        apiKey: userLlmConfigs.apiKey,
        createdAt: userLlmConfigs.createdAt,
        updatedAt: userLlmConfigs.updatedAt,
        model: {
          id: llmModels.id,
          name: llmModels.name,
          displayName: llmModels.displayName,
          description: llmModels.description,
          maxTokens: llmModels.maxTokens,
          costPer1kTokens: llmModels.costPer1kTokens,
        },
        provider: {
          id: llmProviders.id,
          name: llmProviders.name,
          displayName: llmProviders.displayName,
        }
      })
      .from(userLlmConfigs)
      .innerJoin(llmModels, eq(userLlmConfigs.modelId, llmModels.id))
      .innerJoin(llmProviders, eq(userLlmConfigs.providerId, llmProviders.id))
      .where(eq(userLlmConfigs.userId, userId));

    // Transform to hide API key and show only if it exists
    const transformedConfigs = configs.map(config => ({
      ...config,
      hasApiKey: !!(config.apiKey && config.apiKey.length > 0),
      apiKey: undefined, // Remove actual API key from response
    }));

    res.json(transformedConfigs);
  } catch (error) {
    console.error("Error fetching user LLM configs:", error);
    res.status(500).json({ error: "Failed to fetch user configurations" });
  }
});

// Create or update user LLM configuration
const upsertConfigSchema = z.object({
  providerId: z.string(),
  modelId: z.string(),
  apiKey: z.string().min(1, "API key is required"),
  isEnabled: z.boolean().default(true),
  isPrimary: z.boolean().default(false),
});

llmRouter.post("/user-configs", async (req, res) => {
  try {
    const userId = (req as any).user?.id || "demo-user-123";
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const data = upsertConfigSchema.parse(req.body);

    // If this is set as primary, make sure no other config is primary
    if (data.isPrimary) {
      await db
        .update(userLlmConfigs)
        .set({ isPrimary: false })
        .where(eq(userLlmConfigs.userId, userId));
    }

    // Check if configuration already exists
    const existingConfig = await db
      .select()
      .from(userLlmConfigs)
      .where(and(
        eq(userLlmConfigs.userId, userId),
        eq(userLlmConfigs.modelId, data.modelId)
      ));

    let result;
    if (existingConfig.length > 0) {
      // Update existing configuration
      result = await db
        .update(userLlmConfigs)
        .set({
          apiKey: data.apiKey,
          isEnabled: data.isEnabled,
          isPrimary: data.isPrimary,
          updatedAt: new Date(),
        })
        .where(and(
          eq(userLlmConfigs.userId, userId),
          eq(userLlmConfigs.modelId, data.modelId)
        ))
        .returning();
    } else {
      // Create new configuration
      result = await db
        .insert(userLlmConfigs)
        .values({
          userId,
          providerId: data.providerId,
          modelId: data.modelId,
          apiKey: data.apiKey,
          isEnabled: data.isEnabled,
          isPrimary: data.isPrimary,
        })
        .returning();
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error saving LLM config:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to save configuration" });
  }
});

// Update user LLM configuration
llmRouter.put("/user-configs/:configId", async (req, res) => {
  try {
    const userId = (req as any).user?.id || "demo-user-123";
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { configId } = req.params;
    const data = z.object({
      apiKey: z.string().optional(),
      isEnabled: z.boolean().optional(),
      isPrimary: z.boolean().optional(),
    }).parse(req.body);

    // If this is set as primary, make sure no other config is primary
    if (data.isPrimary) {
      await db
        .update(userLlmConfigs)
        .set({ isPrimary: false })
        .where(eq(userLlmConfigs.userId, userId));
    }

    const result = await db
      .update(userLlmConfigs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(
        eq(userLlmConfigs.id, configId),
        eq(userLlmConfigs.userId, userId)
      ))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Configuration not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error updating LLM config:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update configuration" });
  }
});

// Delete user LLM configuration
llmRouter.delete("/user-configs/:configId", async (req, res) => {
  try {
    const userId = (req as any).user?.id || "demo-user-123";
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { configId } = req.params;

    const result = await db
      .delete(userLlmConfigs)
      .where(and(
        eq(userLlmConfigs.id, configId),
        eq(userLlmConfigs.userId, userId)
      ))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Configuration not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting LLM config:", error);
    res.status(500).json({ error: "Failed to delete configuration" });
  }
});