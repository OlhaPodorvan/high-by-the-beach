const domain = process.env.SHOPIFY_STORE_DOMAIN || "";
const adminToken = process.env.SHOPIFY_ADMIN_API_TOKEN || "";
const apiVersion = "2025-10";

async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`https://${domain}/admin/api/${apiVersion}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify Admin API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export type DraftOrderInput = {
  line_items: { variant_id: number; quantity: number }[];
  email: string;
  shipping_address: {
    first_name: string;
    last_name: string;
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
};

export async function createAndCompleteDraftOrder(input: DraftOrderInput) {
  const { draft_order } = await adminFetch<{ draft_order: { id: number } }>(
    "/draft_orders.json",
    { method: "POST", body: JSON.stringify({ draft_order: input }) }
  );

  await adminFetch(`/draft_orders/${draft_order.id}/complete.json`, {
    method: "PUT",
  });
}
