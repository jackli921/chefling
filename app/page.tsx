"use client";

import { useState } from "react";
import { RecipeForm } from "@/components/RecipeForm";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { LoadingState } from "@/components/LoadingState";
import type { Recipe } from "@/types/recipe";

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async (url: string, targetLanguage: string) => {
    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, targetLanguage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to parse recipe");
      }

      setRecipe(data.recipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
        Recipe Parser
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Paste a recipe URL from any language and get a clean, translated recipe
      </p>

      <RecipeForm onSubmit={handleParse} disabled={loading} />

      {loading && <LoadingState />}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {recipe && <RecipeDisplay recipe={recipe} />}
    </main>
  );
}
