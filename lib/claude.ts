import Anthropic from "@anthropic-ai/sdk";
import type { Recipe } from "@/types/recipe";
import { buildRecipeExtractionPrompt } from "./prompts";

const anthropic = new Anthropic();

export class ClaudeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClaudeError";
  }
}

export async function parseRecipeWithClaude(
  content: string,
  jsonLd: Record<string, unknown> | undefined,
  targetLanguage: string
): Promise<Recipe> {
  const prompt = buildRecipeExtractionPrompt(content, jsonLd, targetLanguage);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new ClaudeError("No text response from Claude");
  }

  const responseText = textBlock.text.trim();

  // Try to extract JSON from the response
  let jsonText = responseText;

  // Handle case where response might be wrapped in markdown code blocks
  const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1].trim();
  }

  let recipe: Recipe;
  try {
    recipe = JSON.parse(jsonText);
  } catch {
    throw new ClaudeError("Failed to parse recipe JSON from Claude response");
  }

  // Validate required fields
  if (!recipe.title || !Array.isArray(recipe.ingredients) || !Array.isArray(recipe.steps)) {
    throw new ClaudeError("Invalid recipe structure returned from Claude");
  }

  return recipe;
}
