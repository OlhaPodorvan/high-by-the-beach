// Shared sort param → Shopify sort keys mapping
// productsSortKey uses ProductSortKeys enum
// collectionSortKey uses ProductCollectionSortKeys enum

export type SortOptions = { sortKey?: string; reverse?: boolean };

export function parseProductsSort(sort?: string): SortOptions {
  switch (sort) {
    case "BEST_SELLING":  return { sortKey: "BEST_SELLING" };
    case "TITLE_ASC":     return { sortKey: "TITLE", reverse: false };
    case "TITLE_DESC":    return { sortKey: "TITLE", reverse: true };
    case "PRICE_ASC":     return { sortKey: "PRICE", reverse: false };
    case "PRICE_DESC":    return { sortKey: "PRICE", reverse: true };
    case "CREATED_DESC":  return { sortKey: "CREATED_AT", reverse: true };
    default:              return {};
  }
}

export function parseCollectionSort(sort?: string): SortOptions {
  switch (sort) {
    case "BEST_SELLING":  return { sortKey: "BEST_SELLING" };
    case "TITLE_ASC":     return { sortKey: "TITLE", reverse: false };
    case "TITLE_DESC":    return { sortKey: "TITLE", reverse: true };
    case "PRICE_ASC":     return { sortKey: "PRICE", reverse: false };
    case "PRICE_DESC":    return { sortKey: "PRICE", reverse: true };
    case "CREATED_DESC":  return { sortKey: "CREATED", reverse: true };
    default:              return {};
  }
}
