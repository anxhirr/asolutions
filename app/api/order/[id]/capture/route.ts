import { env } from "@/env.mjs";
import { getPayPalAccessToken } from "@/lib/paypal";

const endpoint = env.PAYPAL_REST_API;

export const POST = async (req) => {
  const token = await getPayPalAccessToken();
  const body = await req.json();
  const res = await fetch(
    `${endpoint}/v2/checkout/orders/${body.orderID}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only).
        // Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
    },
  );

  const data = await res.json();
  console.log("CAPTURE ORDER data", data);

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
