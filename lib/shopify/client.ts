import type { ShopifyFetchOptions, ShopifyResponse } from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN || "";
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const apiVersion = "2025-10";

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

export async function shopifyFetch<T, V = Record<string, unknown>>({
  query,
  variables,
  tags,
  cache,
}: ShopifyFetchOptions<V>): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache === "no-store"
      ? { cache: "no-store" }
      : { next: { revalidate: 60, ...(tags ? { tags } : {}) } }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const json: ShopifyResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("\n"));
  }

  return json.data;
}
