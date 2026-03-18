import { shopifyFetch } from "./client";
import type { Collection, Product, ProductFilter, ShopifyImage } from "./types";

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

type RawCollection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    nodes: RawProduct[];
    filters: ProductFilter[];
  };
};

function normalizeProduct(raw: RawProduct): Product {
  return { ...raw, images: raw.images.nodes, variants: raw.variants.nodes };
}

const COLLECTIONS_QUERY = `
  query GetCollections {
    collections(first: 20) {
      nodes {
        id
        title
        handle
        description
        image { url altText width height }
      }
    }
  }
`;

const COLLECTION_QUERY = `
  query GetCollection(
    $handle: String!
    $first: Int!
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image { url altText width height }
      products(first: $first, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
        nodes {
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
        filters {
          id
          label
          type
          values { id label count input }
        }
      }
    }
  }
`;

export async function getCollections(): Promise<Collection[]> {
  const data = await shopifyFetch<{ collections: { nodes: Collection[] } }>({
    query: COLLECTIONS_QUERY,
    tags: ["collections"],
  });
  return data.collections.nodes;
}

export async function getCollection(
  handle: string,
  options: {
    filters?: Record<string, unknown>[];
    sortKey?: string;
    reverse?: boolean;
    first?: number;
  } = {}
): Promise<{
  collection: Collection;
  products: Product[];
  filters: ProductFilter[];
} | null> {
  const {
    filters = [],
    sortKey = "COLLECTION_DEFAULT",
    reverse = false,
    first = 24,
  } = options;

  const data = await shopifyFetch<
    { collection: RawCollection | null },
    {
      handle: string;
      first: number;
      filters: Record<string, unknown>[];
      sortKey: string;
      reverse: boolean;
    }
  >({
    query: COLLECTION_QUERY,
    variables: { handle, first, filters, sortKey, reverse },
    tags: ["collections", `collection-${handle}`],
  });

  if (!data.collection) return null;

  return {
    collection: {
      id: data.collection.id,
      title: data.collection.title,
      handle: data.collection.handle,
      description: data.collection.description,
      image: data.collection.image,
    },
    products: data.collection.products.nodes.map(normalizeProduct),
    filters: data.collection.products.filters,
  };
}
