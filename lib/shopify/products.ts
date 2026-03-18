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

function normalizeProduct(raw: RawProduct): Product {
  return { ...raw, images: raw.images.nodes, variants: raw.variants.nodes };
}

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    featuredImage { url altText width height }
    images(first: 20) {
      nodes { url altText width height }
    }
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
`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      nodes { ...ProductFields }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
  ${PRODUCT_FRAGMENT}
`;

export type ProductsOptions = {
  sortKey?: string;
  reverse?: boolean;
  query?: string;
};

export async function getProducts(
  first = 12,
  options: ProductsOptions = {}
): Promise<Product[]> {
  const { sortKey, reverse, query } = options;
  const data = await shopifyFetch<
    { products: { nodes: RawProduct[] } },
    { first: number; sortKey?: string; reverse?: boolean; query?: string }
  >({
    query: PRODUCTS_QUERY,
    variables: { first, sortKey, reverse, query },
    tags: ["products"],
  });
  return data.products.nodes.map(normalizeProduct);
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<
    { product: RawProduct | null },
    { handle: string }
  >({
    query: PRODUCT_QUERY,
    variables: { handle },
    tags: ["products", `product-${handle}`],
  });
  return data.product ? normalizeProduct(data.product) : null;
}
