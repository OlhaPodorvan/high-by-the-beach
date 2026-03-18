import { shopifyFetch } from "./client";

export type ShopifyPage = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
};

const PAGE_QUERY = `
  query GetPage($handle: String!) {
    page(handle: $handle) {
      id
      title
      handle
      body
      bodySummary
    }
  }
`;

export async function getPage(handle: string): Promise<ShopifyPage | null> {
  const data = await shopifyFetch<
    { page: ShopifyPage | null },
    { handle: string }
  >({
    query: PAGE_QUERY,
    variables: { handle },
    tags: [`page-${handle}`],
  });
  return data.page;
}
