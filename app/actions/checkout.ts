"use server";

import { createAndCompleteDraftOrder } from "@/lib/shopify/admin";
import type { CartLine } from "@/lib/shopify/types";

export type CheckoutFormData = {
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

function extractNumericId(gid: string): number {
  return parseInt(gid.split("/").pop() ?? "0", 10);
}

export async function placeOrderAction(
  form: CheckoutFormData,
  lines: CartLine[]
): Promise<void> {
  const [firstName, ...rest] = form.name.trim().split(" ");
  const lastName = rest.join(" ") || "-";

  await createAndCompleteDraftOrder({
    email: form.email,
    line_items: lines.map((line) => ({
      variant_id: extractNumericId(line.merchandise.id),
      quantity: line.quantity,
    })),
    shipping_address: {
      first_name: firstName,
      last_name: lastName,
      address1: form.address,
      city: form.city,
      province: form.state,
      zip: form.zip,
      country: form.country,
    },
  });
}
