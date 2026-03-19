"use server";

import Anthropic from "@anthropic-ai/sdk";

export type AISearchResult = {
  /** Cleaned query with price/filter language stripped out, passed to Shopify text search */
  cleanQuery: string;
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
};

const client = new Anthropic();

export async function aiSearchAction(
  rawQuery: string,
  availableProductTypes: string[]
): Promise<AISearchResult> {
  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Extract structured filters from this product search query for a beach store.
Available product types: ${availableProductTypes.join(", ")}.
Query: "${rawQuery}"
Return JSON only, no explanation: { "cleanQuery": string, "productType"?: string, "minPrice"?: number, "maxPrice"?: number, "tags"?: string[] }

Rules:
- First, mentally correct any typos or misspellings in the query before applying all other rules (e.g. "budjet" → "budget", "cheep" → "cheap").
- cleanQuery: the core product keywords only, strip all price/filter language (including typo-corrected price words like "budjet" → strip as "budget").
- productType: match abbreviations, synonyms, and partial names to the closest available type (e.g. "flips" → "Flip Flops", "sunnies" → "Sunglasses", "trunks" → "Swim Trunks"). Must exactly match one of the available types or be omitted.
- Price adjectives: infer a realistic price range based on the product type and typical market prices. For example, "cheap sunglasses" → maxPrice ~20, "cheap surfboard" → maxPrice ~200, "luxury towel" → minPrice ~80. Apply this to the corrected version of any misspelled price word. Explicit amounts like "under $50" → maxPrice 50.
- tags: relevant descriptive tags inferred from the query (e.g. "waterproof", "kids", "UV protection").`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from the response (Claude may wrap it in markdown code fences)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { cleanQuery: rawQuery };

    const parsed = JSON.parse(jsonMatch[0]) as AISearchResult;
    return {
      cleanQuery: parsed.cleanQuery || rawQuery,
      productType: parsed.productType,
      minPrice: parsed.minPrice,
      maxPrice: parsed.maxPrice,
      tags: parsed.tags,
    };
  } catch (err) {
    console.error("AI search error:", err);
    return { cleanQuery: rawQuery };
  }
}
