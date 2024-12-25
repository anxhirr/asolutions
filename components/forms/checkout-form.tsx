import {
  CreateOrderRequestBody,
  OnApproveData,
  OrderResponseBody,
} from "@paypal/paypal-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

import { env } from "@/env.mjs";

const clientId = env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export const CheckoutForm = ({}: {}) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "EUR",
      }}
    >
      <PayPalButtons
        style={{
          shape: "pill",
          color: "black",
          label: "pay",
        }}
        createOrder={createOrder}
        onApprove={captureOrder}
        onError={(err) => {
          console.error("onError", err);
        }}
      />
    </PayPalScriptProvider>
  );
};

const createOrder = async () => {
  try {
    const body: CreateOrderRequestBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: "0.01",
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            shipping_preference: "NO_SHIPPING",
          },
          address: {
            country_code: "AL",
          },
        },
      },
    };

    const res = await fetch("api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as OrderResponseBody;
    return data.id as string;
  } catch (error) {
    console.error(error);
    return ""; // TODO: handle error
  }
};
const captureOrder = async ({ orderID }: OnApproveData) => {
  try {
    // TODO: add types
    const body = {
      orderID,
    };
    const res = await fetch(`api/order/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log("data", data);
    return data.id;
  } catch (error) {
    console.error(error);
  }
};
