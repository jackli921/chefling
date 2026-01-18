"use client";

import type { Recipe } from "@/types/recipe";

interface RecipeDisplayProps {
  recipe: Recipe;
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const handleCopy = async () => {
    const text = formatRecipeAsText(recipe);
    await navigator.clipboard.writeText(text);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6 print:shadow-none print:border-none">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{recipe.title}</h2>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900
                       border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Copy
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900
                       border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Print
          </button>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
        {recipe.servings && (
          <span className="flex items-center gap-1">
            <span className="font-medium">Servings:</span> {recipe.servings}
          </span>
        )}
        {recipe.prepTime && (
          <span className="flex items-center gap-1">
            <span className="font-medium">Prep:</span> {recipe.prepTime}
          </span>
        )}
        {recipe.cookTime && (
          <span className="flex items-center gap-1">
            <span className="font-medium">Cook:</span> {recipe.cookTime}
          </span>
        )}
        {recipe.originalLanguage !== recipe.translatedTo && (
          <span className="text-blue-600">
            Translated from {recipe.originalLanguage}
          </span>
        )}
      </div>

      {/* Ingredients */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex text-gray-700">
              <span className="w-24 flex-shrink-0 font-medium">
                {ingredient.amount}
                {ingredient.unit ? ` ${ingredient.unit}` : ""}
              </span>
              <span>
                {ingredient.item}
                {ingredient.notes && (
                  <span className="text-gray-500 ml-1">({ingredient.notes})</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
        <ol className="space-y-4">
          {recipe.steps.map((step) => (
            <li key={step.number} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700
                               rounded-full flex items-center justify-center font-medium">
                {step.number}
              </span>
              <div className="flex-1 pt-1">
                <p className="text-gray-700">{step.instruction}</p>
                {step.tip && (
                  <p className="mt-1 text-sm text-gray-500 italic">
                    Tip: {step.tip}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function formatRecipeAsText(recipe: Recipe): string {
  const lines: string[] = [];

  lines.push(recipe.title);
  lines.push("=".repeat(recipe.title.length));
  lines.push("");

  if (recipe.servings || recipe.prepTime || recipe.cookTime) {
    if (recipe.servings) lines.push(`Servings: ${recipe.servings}`);
    if (recipe.prepTime) lines.push(`Prep time: ${recipe.prepTime}`);
    if (recipe.cookTime) lines.push(`Cook time: ${recipe.cookTime}`);
    lines.push("");
  }

  lines.push("INGREDIENTS");
  lines.push("-----------");
  for (const ing of recipe.ingredients) {
    let line = `${ing.amount}${ing.unit ? " " + ing.unit : ""} ${ing.item}`;
    if (ing.notes) line += ` (${ing.notes})`;
    lines.push(`- ${line}`);
  }
  lines.push("");

  lines.push("INSTRUCTIONS");
  lines.push("------------");
  for (const step of recipe.steps) {
    lines.push(`${step.number}. ${step.instruction}`);
    if (step.tip) lines.push(`   Tip: ${step.tip}`);
  }

  return lines.join("\n");
}
