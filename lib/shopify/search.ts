import { shopifyFetch } from "./client";
import type { Product, RawProduct } from "./types";
import { normalizeProduct, PRODUCT_FRAGMENT } from "./products";

type SearchData = {
  search: {
    totalCount: number;
    nodes: RawProduct[];
  };
};

export type SearchFilters = {
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
};

export function buildProductFilters(filters: SearchFilters): Record<string, unknown>[] {
  const result: Record<string, unknown>[] = [];
  if (filters.productType) result.push({ productType: filters.productType });
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    result.push({ price: { min: filters.minPrice, max: filters.maxPrice } });
  }
  filters.tags?.forEach((tag) => result.push({ tag }));
  return result;
}

const SEARCH_QUERY = `
  query Search($query: String!, $first: Int!, $productFilters: [ProductFilter!]) {
    search(query: $query, first: $first, types: PRODUCT, productFilters: $productFilters) {
      totalCount
      nodes {
        ... on Product { ...ProductFields }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export async function searchProducts(
  query: string,
  first = 24,
  filters: SearchFilters = {}
): Promise<{ products: Product[]; totalCount: number }> {
  const productFilters = buildProductFilters(filters);

  const data = await shopifyFetch<
    SearchData,
    { query: string; first: number; productFilters: Record<string, unknown>[] }
  >({
    query: SEARCH_QUERY,
    variables: { query, first, productFilters },
    cache: "no-store",
  });

  return {
    totalCount: data.search.totalCount,
    products: data.search.nodes.map(normalizeProduct),
  };
}
