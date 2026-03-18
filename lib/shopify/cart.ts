import { shopifyFetch } from "./client";
import type { Cart, ShopifyImage, Money, SelectedOption } from "./types";

type RawCartLine = {
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

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: { nodes: RawCartLine[] };
};

function normalizeCart(raw: RawCart): Cart {
  return { ...raw, lines: raw.lines.nodes };
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions { name value }
            price { amount currencyCode }
            product {
              title
              handle
              featuredImage { url altText width height }
            }
          }
        }
      }
    }
  }
`;

const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
  ${CART_FRAGMENT}
`;

const CREATE_CART = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
    }
  }
  ${CART_FRAGMENT}
`;

const ADD_TO_CART = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
    }
  }
  ${CART_FRAGMENT}
`;

const UPDATE_CART = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
    }
  }
  ${CART_FRAGMENT}
`;

const REMOVE_FROM_CART = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
    }
  }
  ${CART_FRAGMENT}
`;

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<
    { cart: RawCart | null },
    { cartId: string }
  >({
    query: GET_CART,
    variables: { cartId },
    cache: "no-store",
  });
  return data.cart ? normalizeCart(data.cart) : null;
}

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[] = []
): Promise<Cart> {
  const data = await shopifyFetch<
    { cartCreate: { cart: RawCart } },
    { lines: { merchandiseId: string; quantity: number }[] }
  >({
    query: CREATE_CART,
    variables: { lines },
    cache: "no-store",
  });
  return normalizeCart(data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<
    { cartLinesAdd: { cart: RawCart } },
    { cartId: string; lines: { merchandiseId: string; quantity: number }[] }
  >({
    query: ADD_TO_CART,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return normalizeCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<
    { cartLinesUpdate: { cart: RawCart } },
    { cartId: string; lines: { id: string; quantity: number }[] }
  >({
    query: UPDATE_CART,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return normalizeCart(data.cartLinesUpdate.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = await shopifyFetch<
    { cartLinesRemove: { cart: RawCart } },
    { cartId: string; lineIds: string[] }
  >({
    query: REMOVE_FROM_CART,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  return normalizeCart(data.cartLinesRemove.cart);
}
