import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { shopifyFetch } from "@/lib/shopify/client";

describe("shopifyFetch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns data on a successful response", async () => {
    const mockData = { products: { nodes: [] } };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    });

    const result = await shopifyFetch({ query: "{ products { nodes { id } } }" });
    expect(result).toEqual(mockData);
  });

  it("throws on an HTTP error response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    await expect(shopifyFetch({ query: "{ }" })).rejects.toThrow(
      "Shopify API error: 401 Unauthorized"
    );
  });

  it("throws when the response contains GraphQL errors", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: null,
        errors: [{ message: "Field 'foo' doesn't exist on type 'QueryRoot'" }],
      }),
    });

    await expect(shopifyFetch({ query: "{ foo }" })).rejects.toThrow(
      "Field 'foo' doesn't exist on type 'QueryRoot'"
    );
  });

  it("joins multiple GraphQL errors into one message", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: null,
        errors: [{ message: "Error one" }, { message: "Error two" }],
      }),
    });

    await expect(shopifyFetch({ query: "{ }" })).rejects.toThrow("Error one\nError two");
  });

  it("passes variables and cache settings to fetch", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: {} }),
    });

    await shopifyFetch({
      query: "query Q($id: ID!) { product(id: $id) { title } }",
      variables: { id: "gid://shopify/Product/1" },
      cache: "no-store",
    });

    const [, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(init.body);
    expect(body.variables).toEqual({ id: "gid://shopify/Product/1" });
    expect(init.cache).toBe("no-store");
  });
});
