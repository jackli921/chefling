import Groq from "groq-sdk";
import type { Recipe } from "@/types/recipe";
import { buildRecipeExtractionPrompt } from "./prompts";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 4096,
  });

  const responseText = completion.choices[0]?.message?.content?.trim();

  if (!responseText) {
    throw new ClaudeError("No text response from Groq");
  }

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
    throw new ClaudeError("Failed to parse recipe JSON from Groq response");
  }

  // Validate required fields
  if (!recipe.title || !Array.isArray(recipe.ingredients) || !Array.isArray(recipe.steps)) {
    throw new ClaudeError("Invalid recipe structure returned from Groq");
  }

  return recipe;
}
