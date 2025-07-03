import { NextRequest, NextResponse } from "next/server";
import {
  CreateSubscriptionRequestBody,
  SubscriptionResponseBody,
} from "@paypal/paypal-js";

import { env } from "@/env.mjs";
import { getPayPalAccessToken } from "@/lib/paypal";

const endpoint = env.PAYPAL_REST_API;
const planId = env.PAYPAL_PLAN_ID;
// const planId = "P-8H940073V81075441NBTO64Y";

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await getPayPalAccessToken();
    console.log("access_token", access_token);
    const body: CreateSubscriptionRequestBody = {
      plan_id: planId,
    };
    const res = await fetch(`${endpoint}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as SubscriptionResponseBody;
    const subscriptionId = data.id;
    if (!subscriptionId) {
      return NextResponse.json(
        { error: "No subscription ID found", details: data },
        { status: 500 },
      );
    }
    return NextResponse.json({ subscriptionId });
  } catch (error: any) {
    console.error("PayPal subscription error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
