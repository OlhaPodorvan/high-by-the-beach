import { shopifyFetch } from "./client";
import type { Product, ShopifyImage } from "./types";

type RawProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  options: { id: string; name: string; values: string[] }[];
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
      selectedOptions: { name: string; value: string }[];
    }[];
  };
};

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

function buildProductFilters(filters: SearchFilters): Record<string, unknown>[] {
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
        ... on Product {
          id
          title
          handle
          description
          descriptionHtml
          featuredImage { url altText width height }
          images(first: 20) { nodes { url altText width height } }
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          options { id name values }
          variants(first: 100) {
            nodes {
              id
              title
              availableForSale
              price { amount currencyCode }
              selectedOptions { name value }
            }
          }
        }
      }
    }
  }
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
    products: data.search.nodes.map((p) => ({
      ...p,
      images: p.images.nodes,
      variants: p.variants.nodes,
    })),
  };
}
