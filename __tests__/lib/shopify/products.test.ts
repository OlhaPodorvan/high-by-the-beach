import { describe, it, expect } from "vitest";
import { normalizeProduct } from "@/lib/shopify/products";

const rawProduct = {
  id: "gid://shopify/Product/1",
  title: "Beach Hat",
  handle: "beach-hat",
  description: "A great hat.",
  descriptionHtml: "<p>A great hat.</p>",
  featuredImage: { url: "https://cdn.shopify.com/hat.jpg", altText: "Hat", width: 800, height: 800 },
  images: {
    nodes: [
      { url: "https://cdn.shopify.com/hat.jpg", altText: "Hat", width: 800, height: 800 },
      { url: "https://cdn.shopify.com/hat-2.jpg", altText: "Hat side", width: 800, height: 800 },
    ],
  },
  priceRange: {
    minVariantPrice: { amount: "29.99", currencyCode: "USD" },
    maxVariantPrice: { amount: "29.99", currencyCode: "USD" },
  },
  options: [{ id: "opt1", name: "Size", values: ["S", "M", "L"] }],
  variants: {
    nodes: [
      {
        id: "gid://shopify/ProductVariant/1",
        title: "S",
        availableForSale: true,
        price: { amount: "29.99", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "S" }],
      },
    ],
  },
};

describe("normalizeProduct", () => {
  it("flattens images.nodes into images array", () => {
    const product = normalizeProduct(rawProduct);
    expect(product.images).toEqual(rawProduct.images.nodes);
    expect(Array.isArray(product.images)).toBe(true);
  });

  it("flattens variants.nodes into variants array", () => {
    const product = normalizeProduct(rawProduct);
    expect(product.variants).toEqual(rawProduct.variants.nodes);
    expect(Array.isArray(product.variants)).toBe(true);
  });

  it("preserves all scalar fields", () => {
    const product = normalizeProduct(rawProduct);
    expect(product.id).toBe(rawProduct.id);
    expect(product.title).toBe(rawProduct.title);
    expect(product.handle).toBe(rawProduct.handle);
    expect(product.description).toBe(rawProduct.description);
    expect(product.priceRange).toEqual(rawProduct.priceRange);
    expect(product.options).toEqual(rawProduct.options);
    expect(product.featuredImage).toEqual(rawProduct.featuredImage);
  });

  it("handles products with no images", () => {
    const product = normalizeProduct({ ...rawProduct, images: { nodes: [] } });
    expect(product.images).toEqual([]);
  });

  it("handles null featuredImage", () => {
    const product = normalizeProduct({ ...rawProduct, featuredImage: null });
    expect(product.featuredImage).toBeNull();
  });
});
