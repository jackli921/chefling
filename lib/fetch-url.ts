export class FetchError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "FetchError";
  }
}

export async function fetchUrl(url: string): Promise<string> {
  const parsedUrl = parseAndValidateUrl(url);

  const response = await fetch(parsedUrl.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; RecipeParser/1.0; +https://recipe-parser.vercel.app)",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new FetchError(
      `Failed to fetch URL: ${response.statusText}`,
      response.status
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
    throw new FetchError("URL does not return HTML content");
  }

  const html = await response.text();

  if (!html || html.trim().length === 0) {
    throw new FetchError("URL returned empty content");
  }

  return html;
}

function parseAndValidateUrl(url: string): URL {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new FetchError("Invalid URL format");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new FetchError("URL must use HTTP or HTTPS protocol");
  }

  return parsedUrl;
}
