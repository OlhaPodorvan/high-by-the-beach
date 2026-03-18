import { shopifyFetch } from "./client";
import type { MenuItem } from "./types";

type RawMenuItem = {
  id: string;
  title: string;
  url: string;
  items: Omit<RawMenuItem, "items">[];
};

const MENU_QUERY = `
  query GetMenu($handle: String!) {
    menu(handle: $handle) {
      items {
        id
        title
        url
        items {
          id
          title
          url
        }
      }
    }
  }
`;

function parseUrl(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function normalizeItem(item: RawMenuItem): MenuItem {
  return {
    ...item,
    url: parseUrl(item.url),
    items: item.items.map((sub) => ({ ...sub, url: parseUrl(sub.url) })),
  };
}

export async function getMenu(handle: string): Promise<MenuItem[]> {
  const data = await shopifyFetch<
    { menu: { items: RawMenuItem[] } | null },
    { handle: string }
  >({
    query: MENU_QUERY,
    variables: { handle },
    tags: ["menu"],
  });
  return data.menu?.items.map(normalizeItem) ?? [];
}
