export interface Ingredient {
  item: string;
  amount: string;
  unit?: string;
  notes?: string;
}

export interface Step {
  number: number;
  instruction: string;
  tip?: string;
}

export interface Recipe {
  title: string;
  servings?: string;
  prepTime?: string;
  cookTime?: string;
  ingredients: Ingredient[];
  steps: Step[];
  originalLanguage: string;
  translatedTo: string;
}

export interface ParseRequest {
  url: string;
  targetLanguage: string;
}

export interface ParseResponse {
  recipe?: Recipe;
  error?: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese (Simplified)" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];
