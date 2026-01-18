export function buildRecipeExtractionPrompt(
  content: string,
  jsonLd: Record<string, unknown> | undefined,
  targetLanguage: string
): string {
  const jsonLdSection = jsonLd
    ? `
## Structured Data Found (JSON-LD)
The page contains structured recipe data that may help with extraction:
\`\`\`json
${JSON.stringify(jsonLd, null, 2)}
\`\`\`
`
    : "";

  return `You are a recipe extraction and translation expert. Your task is to extract recipe information from the provided webpage content and output it in a structured JSON format, translated to ${targetLanguage}.

## Instructions

1. Extract the recipe title, servings, prep time, and cook time if available
2. Extract ALL ingredients with their amounts, units, and any notes
3. Extract ALL cooking steps in order
4. Detect the original language of the recipe
5. Translate everything to ${targetLanguage} while preserving cooking terminology
6. For measurements, keep the original units but translate unit names if needed
7. If information is missing or unclear, omit that field rather than guessing

## Output Format

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):

{
  "title": "Recipe Title",
  "servings": "4 servings",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes",
  "ingredients": [
    {
      "item": "ingredient name",
      "amount": "2",
      "unit": "cups",
      "notes": "optional notes like 'diced' or 'room temperature'"
    }
  ],
  "steps": [
    {
      "number": 1,
      "instruction": "Step instruction text",
      "tip": "optional helpful tip"
    }
  ],
  "originalLanguage": "detected language name",
  "translatedTo": "${targetLanguage}"
}
${jsonLdSection}
## Webpage Content

${content.slice(0, 15000)}

## Response

Return only the JSON object, no additional text:`;
}
