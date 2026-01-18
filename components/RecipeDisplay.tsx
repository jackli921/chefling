"use client";

import { useState } from "react";
import type { Recipe } from "@/types/recipe";

interface RecipeDisplayProps {
  recipe: Recipe;
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

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

      {/* Ingredients - Split Alignment Checklist */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
        <ul className="space-y-1">
          {recipe.ingredients.map((ingredient, index) => {
            const isChecked = checkedIngredients.has(index);
            return (
              <li
                key={index}
                onClick={() => toggleIngredient(index)}
                className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer
                           transition-all duration-200 hover:bg-stone-50
                           ${isChecked ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center
                               transition-colors duration-200
                               ${isChecked
                                 ? "bg-emerald-500 border-emerald-500 text-white"
                                 : "border-stone-300"}`}
                  >
                    {isChecked && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-stone-700 ${isChecked ? "line-through text-stone-400" : ""}`}>
                    {ingredient.item}
                    {ingredient.notes && (
                      <span className="text-stone-400 ml-1">({ingredient.notes})</span>
                    )}
                  </span>
                </div>
                <span className={`text-right font-medium tabular-nums
                                 ${isChecked ? "line-through text-stone-400" : "text-stone-600"}`}>
                  {ingredient.amount}
                  {ingredient.unit ? ` ${ingredient.unit}` : ""}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Steps - Focus Mode Instruction Highlighting */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
        <div className="relative">
          {recipe.steps.map((step, index) => {
            const isActive = activeStep === step.number;
            const isLast = index === recipe.steps.length - 1;

            return (
              <div key={step.number} className="relative flex gap-4">
                {/* Connecting Line */}
                {!isLast && (
                  <div className="absolute left-4 top-10 w-px h-[calc(100%-1rem)] bg-stone-200" />
                )}

                {/* Step Number */}
                <div
                  className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                             font-medium transition-all duration-200
                             ${isActive
                               ? "bg-amber-500 text-white scale-110"
                               : "bg-stone-100 text-stone-600"}`}
                >
                  {step.number}
                </div>

                {/* Step Content */}
                <div
                  onClick={() => setActiveStep(isActive ? null : step.number)}
                  className={`flex-1 mb-4 p-4 rounded-xl cursor-pointer transition-all duration-200
                             ${isActive
                               ? "bg-amber-50 border-2 border-amber-200 scale-[1.02] shadow-sm"
                               : "bg-white border border-stone-100 opacity-90 hover:opacity-100 hover:border-stone-200"}`}
                >
                  {isActive && (
                    <span className="inline-block px-2 py-0.5 mb-2 text-xs font-medium
                                   bg-amber-200 text-amber-800 rounded-full">
                      Current Step
                    </span>
                  )}
                  <p className={`${isActive ? "text-stone-800" : "text-stone-600"}`}>
                    {step.instruction}
                  </p>
                  {step.tip && (
                    <p className={`mt-2 text-sm italic
                                  ${isActive ? "text-amber-700" : "text-stone-400"}`}>
                      Tip: {step.tip}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
