import { db } from "./db";
import { promptFormats } from "@shared/schema";

export async function seedPromptFormats() {
  try {
    console.log("🌱 Seeding prompt formats...");
    
    const promptFormatsData = [
      {
        name: "CTO",
        description: "(Context → Task → Output)",
        structure: "Background → Instruction → Desired format",
        bestFor: "General use",
        purpose: "Clear, structured prompts",
        isDefault: true,
      },
      {
        name: "IDEAL",
        description: "Identify → Define → Explore → Act → Learn",
        structure: "Identify → Define → Explore → Act → Learn",
        bestFor: "Problem-solving",
        purpose: "Step-by-step critical thinking",
        isDefault: false,
      },
      {
        name: "CUP",
        description: "(Context → User → Purpose)",
        structure: "Situation → Target audience → Goal",
        bestFor: "Marketing, UX, writing",
        purpose: "Focused, audience-driven content",
        isDefault: false,
      },
      {
        name: "GROW",
        description: "Goal → Reality → Options → Way forward",
        structure: "Goal → Reality → Options → Way forward",
        bestFor: "Coaching, planning",
        purpose: "Decision-making and personal development",
        isDefault: false,
      },
      {
        name: "PPO",
        description: "(Persona → Problem → Outcome)",
        structure: "Who → What's the issue → What they want",
        bestFor: "Empathy-based writing",
        purpose: "Customer-centric prompts",
        isDefault: false,
      },
      {
        name: "TACO",
        description: "(Tone → Audience → Context → Objective)",
        structure: "Style → Reader → Scenario → Goal",
        bestFor: "Branding, copywriting",
        purpose: "Voice-aligned messaging",
        isDefault: false,
      },
    ];

    for (const formatData of promptFormatsData) {
      await db
        .insert(promptFormats)
        .values(formatData)
        .onConflictDoNothing();
    }

    console.log("✅ Prompt formats seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding prompt formats:", error);
    throw error;
  }
}