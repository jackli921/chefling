import * as cheerio from "cheerio";

interface ExtractedContent {
  text: string;
  jsonLd?: Record<string, unknown>;
}

export function extractContent(html: string): ExtractedContent {
  const $ = cheerio.load(html);

  // Try to extract JSON-LD structured data first (many recipe sites use this)
  const jsonLd = extractJsonLd($);

  // Remove elements that typically don't contain recipe content
  $(
    "script, style, nav, header, footer, aside, .ad, .advertisement, " +
      ".sidebar, .comments, .social-share, .related-posts, .navigation, " +
      "[role='navigation'], [role='banner'], [role='contentinfo']"
  ).remove();

  // Try to find the main recipe content area
  let mainContent = "";

  // Common recipe content selectors
  const recipeSelectors = [
    "[itemtype*='Recipe']",
    ".recipe",
    ".recipe-content",
    ".recipe-body",
    "#recipe",
    "article",
    "main",
    ".post-content",
    ".entry-content",
  ];

  for (const selector of recipeSelectors) {
    const element = $(selector).first();
    if (element.length > 0) {
      mainContent = element.text();
      break;
    }
  }

  // Fallback to body if no specific recipe container found
  if (!mainContent) {
    mainContent = $("body").text();
  }

  // Clean up the text
  const cleanedText = cleanText(mainContent);

  return {
    text: cleanedText,
    jsonLd: jsonLd || undefined,
  };
}

function extractJsonLd(
  $: cheerio.CheerioAPI
): Record<string, unknown> | null {
  const scripts = $('script[type="application/ld+json"]');

  for (let i = 0; i < scripts.length; i++) {
    try {
      const content = $(scripts[i]).html();
      if (!content) continue;

      const data = JSON.parse(content);

      // Handle array of JSON-LD objects
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        // Check if this is a Recipe type
        if (
          item["@type"] === "Recipe" ||
          (Array.isArray(item["@type"]) && item["@type"].includes("Recipe"))
        ) {
          return item;
        }

        // Check @graph for Recipe
        if (item["@graph"] && Array.isArray(item["@graph"])) {
          const recipe = item["@graph"].find(
            (node: Record<string, unknown>) =>
              node["@type"] === "Recipe" ||
              (Array.isArray(node["@type"]) &&
                (node["@type"] as string[]).includes("Recipe"))
          );
          if (recipe) return recipe;
        }
      }
    } catch {
      // Invalid JSON, continue to next script
      continue;
    }
  }

  return null;
}

function cleanText(text: string): string {
  return (
    text
      // Normalize whitespace
      .replace(/\s+/g, " ")
      // Remove extra line breaks
      .replace(/\n\s*\n/g, "\n")
      // Trim each line
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n")
      // Final trim
      .trim()
  );
}
