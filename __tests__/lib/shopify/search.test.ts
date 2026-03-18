import { describe, it, expect } from "vitest";
import { buildProductFilters } from "@/lib/shopify/search";

describe("buildProductFilters", () => {
  it("returns an empty array when no filters provided", () => {
    expect(buildProductFilters({})).toEqual([]);
  });

  it("includes productType filter when provided", () => {
    const filters = buildProductFilters({ productType: "Sunglasses" });
    expect(filters).toContainEqual({ productType: "Sunglasses" });
  });

  it("includes price range filter when minPrice is set", () => {
    const filters = buildProductFilters({ minPrice: 10 });
    expect(filters).toContainEqual({ price: { min: 10, max: undefined } });
  });

  it("includes price range filter when maxPrice is set", () => {
    const filters = buildProductFilters({ maxPrice: 50 });
    expect(filters).toContainEqual({ price: { min: undefined, max: 50 } });
  });

  it("includes price range filter with both min and max", () => {
    const filters = buildProductFilters({ minPrice: 10, maxPrice: 50 });
    expect(filters).toContainEqual({ price: { min: 10, max: 50 } });
  });

  it("includes a separate filter entry per tag", () => {
    const filters = buildProductFilters({ tags: ["waterproof", "sale"] });
    expect(filters).toContainEqual({ tag: "waterproof" });
    expect(filters).toContainEqual({ tag: "sale" });
    expect(filters).toHaveLength(2);
  });

  it("combines all filter types together", () => {
    const filters = buildProductFilters({
      productType: "Hat",
      minPrice: 20,
      maxPrice: 60,
      tags: ["summer"],
    });
    expect(filters).toHaveLength(3);
    expect(filters).toContainEqual({ productType: "Hat" });
    expect(filters).toContainEqual({ price: { min: 20, max: 60 } });
    expect(filters).toContainEqual({ tag: "summer" });
  });
});
