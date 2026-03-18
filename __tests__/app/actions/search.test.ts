import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.hoisted(() => vi.fn());

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn(() => ({
    messages: { create: mockCreate },
  })),
}));

// Import after the mock is set up
const { aiSearchAction } = await import("@/app/actions/search");

describe("aiSearchAction", () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it("parses a clean JSON response from Claude", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: '{"cleanQuery":"hat","productType":"Hats","minPrice":10,"maxPrice":50}',
        },
      ],
    });

    const result = await aiSearchAction("hat under $50", ["Hats", "Sunglasses"]);
    expect(result).toEqual({
      cleanQuery: "hat",
      productType: "Hats",
      minPrice: 10,
      maxPrice: 50,
      tags: undefined,
    });
  });

  it("extracts JSON from a markdown code fence", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: '```json\n{"cleanQuery":"sunglasses","tags":["sale"]}\n```',
        },
      ],
    });

    const result = await aiSearchAction("sale sunglasses", ["Sunglasses"]);
    expect(result.cleanQuery).toBe("sunglasses");
    expect(result.tags).toEqual(["sale"]);
  });

  it("falls back to the raw query when Claude returns no JSON", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Sorry, I cannot help with that." }],
    });

    const result = await aiSearchAction("beach towel", []);
    expect(result).toEqual({ cleanQuery: "beach towel" });
  });

  it("falls back to the raw query when the API call throws", async () => {
    mockCreate.mockRejectedValueOnce(new Error("Network error"));

    const result = await aiSearchAction("flip flops", []);
    expect(result).toEqual({ cleanQuery: "flip flops" });
  });

  it("uses raw query as cleanQuery when Claude omits it", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: '{"productType":"Sandals"}' }],
    });

    const result = await aiSearchAction("sandals", ["Sandals"]);
    expect(result.cleanQuery).toBe("sandals");
    expect(result.productType).toBe("Sandals");
  });
});
