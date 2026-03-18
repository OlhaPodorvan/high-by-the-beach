import { shopifyFetch } from "./client";

const PRODUCT_TYPES_QUERY = `
  query GetProductTypes {
    productTypes(first: 50) {
      edges {
        node
      }
    }
  }
`;

export async function getProductTypes(): Promise<string[]> {
  const data = await shopifyFetch<{
    productTypes: { edges: { node: string }[] };
  }>({
    query: PRODUCT_TYPES_QUERY,
    tags: ["products"],
  });
  return data.productTypes.edges.map((e) => e.node).filter(Boolean);
}
