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
      model: "claude-opus-4-6",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Extract structured filters from this product search query.
Available product types: ${availableProductTypes.join(", ")}.
Query: "${rawQuery}"
Return JSON only, no explanation: { "cleanQuery": string, "productType"?: string, "minPrice"?: number, "maxPrice"?: number, "tags"?: string[] }
cleanQuery should be the query with price/filter words removed (e.g. "under $50", "cheap", "less than", "beach themed" → stripped).
productType must exactly match one of the available types or be omitted.`,
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
