export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: SelectedOption[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  options: ProductOption[];
  variants: ProductVariant[];
};

export type Collection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    price: Money;
    product: {
      title: string;
      handle: string;
      featuredImage: ShopifyImage | null;
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: CartLine[];
};

export type MenuItem = {
  id: string;
  title: string;
  url: string;
  items: Omit<MenuItem, "items">[];
};

export type FilterValue = {
  id: string;
  label: string;
  count: number;
  input: string;
};

export type ProductFilter = {
  id: string;
  label: string;
  type: string;
  values: FilterValue[];
};

export type ShopifyFetchOptions<V = Record<string, unknown>> = {
  query: string;
  variables?: V;
  tags?: string[];
  cache?: RequestCache;
};

export type ShopifyResponse<T> = {
  data: T;
  errors?: { message: string }[];
};
