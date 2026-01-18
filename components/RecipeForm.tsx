"use client";

import { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import type { LanguageCode } from "@/types/recipe";

interface RecipeFormProps {
  onSubmit: (url: string, targetLanguage: string) => void;
  disabled?: boolean;
}

export function RecipeForm({ onSubmit, disabled }: RecipeFormProps) {
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("en");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim(), language);
    }
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const canSubmit = url.trim() && isValidUrl(url.trim()) && !disabled;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="url" className="text-sm font-medium text-gray-700">
          Recipe URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/recipe"
          disabled={disabled}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900
                     placeholder:text-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-48">
          <LanguageSelector
            value={language}
            onChange={setLanguage}
            disabled={disabled}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium
                     rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
                     focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed
                     transition-colors"
        >
          {disabled ? "Parsing..." : "Parse Recipe"}
        </button>
      </div>
    </form>
  );
}
