import { currency, orders } from "@/supabase/migrations/schema";
import { db } from "@/utils/supabase/db";
import { createAuthClient } from "@/utils/supabase/server";
import { CreateOrderRequestBody, OrderResponseBody } from "@paypal/paypal-js";

import { env } from "@/env.mjs";
import { getPayPalAccessToken } from "@/lib/paypal";

const endpoint = env.PAYPAL_REST_API;

type Currency = (typeof currency.enumValues)[number];

export const POST = async (req) => {
  const client = createAuthClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  console.log("user", user);
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const token = await getPayPalAccessToken();
  const body = (await req.json()) as CreateOrderRequestBody;
  const res = await fetch(`${endpoint}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
      // Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as OrderResponseBody;
  console.log("CREATE ORDER data", data);

  if (!data.id) {
    return new Response("Order creation failed", {
      status: 500,
    });
  }

  await db.insert(orders).values({
    currency: body.purchase_units[0].amount.currency_code as Currency,
    paypalOrderId: data.id,
    status: "PENDING", // just created
    totalAmount: parseFloat(body.purchase_units[0].amount.value), // TODO: map other purchase_units as well
    planId: 1,
    userId: user?.id,
    /**
     * during order creation we do not have the following values
     */
    paypalPaymentId: null,
    paypalPayerId: null,
  });

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
