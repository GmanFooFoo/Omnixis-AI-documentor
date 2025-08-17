import { db } from "./db";
import { llmProviders, llmModels } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedLlmData() {
  try {
    console.log("🌱 Seeding LLM providers and models...");

    // Seed OpenAI provider
    const [openaiProvider] = await db
      .insert(llmProviders)
      .values({
        name: "openai",
        displayName: "OpenAI",
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();

    // Seed Anthropic provider
    const [anthropicProvider] = await db
      .insert(llmProviders)
      .values({
        name: "anthropic",
        displayName: "Anthropic",
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();

    // Seed Mistral provider
    const [mistralProvider] = await db
      .insert(llmProviders)
      .values({
        name: "mistral",
        displayName: "Mistral AI",
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();

    // Get existing providers if they already exist
    const providers = await db.select().from(llmProviders);
    const openai = providers.find(p => p.name === "openai");
    const anthropic = providers.find(p => p.name === "anthropic");
    const mistral = providers.find(p => p.name === "mistral");

    if (openai) {
      // Seed OpenAI models
      const openaiModels = [
        {
          providerId: openai.id,
          name: "gpt-4o",
          displayName: "ChatGPT 4o",
          description: "Most advanced OpenAI model with improved reasoning, coding, and math capabilities",
          maxTokens: 4096,
          costPer1kTokens: 0.03,
          isActive: true,
        },
        {
          providerId: openai.id,
          name: "gpt-4o-mini",
          displayName: "ChatGPT 4o Mini",
          description: "Faster and more affordable version of GPT-4o",
          maxTokens: 4096,
          costPer1kTokens: 0.015,
          isActive: true,
        },
        {
          providerId: openai.id,
          name: "gpt-4-turbo",
          displayName: "ChatGPT 4 Turbo",
          description: "Enhanced version of GPT-4 with improved performance",
          maxTokens: 4096,
          costPer1kTokens: 0.01,
          isActive: true,
        },
      ];

      for (const model of openaiModels) {
        await db
          .insert(llmModels)
          .values(model)
          .onConflictDoNothing();
      }
    }

    if (anthropic) {
      // Seed Anthropic models
      const anthropicModels = [
        {
          providerId: anthropic.id,
          name: "claude-3-5-sonnet-20241022",
          displayName: "Claude 3.5 Sonnet",
          description: "Anthropic's most intelligent model with enhanced reasoning capabilities",
          maxTokens: 4096,
          costPer1kTokens: 0.03,
          isActive: true,
        },
        {
          providerId: anthropic.id,
          name: "claude-3-haiku-20240307",
          displayName: "Claude 3 Haiku",
          description: "Fast and cost-effective model for simple tasks",
          maxTokens: 4096,
          costPer1kTokens: 0.0025,
          isActive: true,
        },
        {
          providerId: anthropic.id,
          name: "claude-3-opus-20240229",
          displayName: "Claude 3 Opus",
          description: "Most powerful model for complex reasoning and analysis",
          maxTokens: 4096,
          costPer1kTokens: 0.075,
          isActive: true,
        },
      ];

      for (const model of anthropicModels) {
        await db
          .insert(llmModels)
          .values(model)
          .onConflictDoNothing();
      }
    }

    if (mistral) {
      // Seed Mistral models
      const mistralModels = [
        {
          providerId: mistral.id,
          name: "mistral-large-latest",
          displayName: "Mistral Large",
          description: "Top-tier reasoning model for high-complexity tasks",
          maxTokens: 4096,
          costPer1kTokens: 0.024,
          isActive: true,
        },
        {
          providerId: mistral.id,
          name: "mistral-small-latest",
          displayName: "Mistral Small",
          description: "Cost-efficient model for simple tasks",
          maxTokens: 4096,
          costPer1kTokens: 0.006,
          isActive: true,
        },
      ];

      for (const model of mistralModels) {
        await db
          .insert(llmModels)
          .values(model)
          .onConflictDoNothing();
      }
    }

    console.log("✅ LLM providers and models seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding LLM data:", error);
  }
}