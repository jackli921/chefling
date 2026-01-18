import { NextRequest, NextResponse } from "next/server";
import { fetchUrl, FetchError } from "@/lib/fetch-url";
import { extractContent } from "@/lib/extract-content";
import { parseRecipeWithClaude, ClaudeError } from "@/lib/claude";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/types/recipe";

interface RequestBody {
  url?: string;
  targetLanguage?: string;
}

export async function POST(request: NextRequest) {
  let body: RequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { url, targetLanguage } = body;

  // Validate URL
  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { error: "URL is required" },
      { status: 400 }
    );
  }

  // Validate target language
  const langCode = (targetLanguage || "en") as LanguageCode;
  const isValidLanguage = SUPPORTED_LANGUAGES.some((l) => l.code === langCode);
  if (!isValidLanguage) {
    return NextResponse.json(
      { error: "Invalid target language" },
      { status: 400 }
    );
  }

  const languageName =
    SUPPORTED_LANGUAGES.find((l) => l.code === langCode)?.name || "English";

  try {
    // Fetch the URL content
    const html = await fetchUrl(url);

    // Extract text content and JSON-LD data
    const { text, jsonLd } = extractContent(html);

    if (text.length < 100) {
      return NextResponse.json(
        { error: "Could not extract sufficient content from the URL" },
        { status: 422 }
      );
    }

    // Parse with Claude
    const recipe = await parseRecipeWithClaude(text, jsonLd, languageName);

    return NextResponse.json({ recipe });
  } catch (error) {
    if (error instanceof FetchError) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${error.message}` },
        { status: error.statusCode || 422 }
      );
    }

    if (error instanceof ClaudeError) {
      return NextResponse.json(
        { error: `Failed to parse recipe: ${error.message}` },
        { status: 422 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
