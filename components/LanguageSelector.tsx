"use client";

import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/types/recipe";

interface LanguageSelectorProps {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
  disabled?: boolean;
}

export function LanguageSelector({
  value,
  onChange,
  disabled,
}: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="language"
        className="text-sm font-medium text-gray-700"
      >
        Translate to
      </label>
      <select
        id="language"
        value={value}
        onChange={(e) => onChange(e.target.value as LanguageCode)}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
