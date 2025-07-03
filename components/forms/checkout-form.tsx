import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "sonner";

import { env } from "@/env.mjs";

const clientId = env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export const CheckoutForm = ({}: {}) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "EUR",
        intent: "subscription",
        vault: true,
      }}
    >
      <PayPalButtons
        style={{
          shape: "pill",
          color: "black",
          label: "subscribe",
        }}
        createSubscription={createSubscription}
        onApprove={async (data, actions) => {
          // data.subscriptionID contains the PayPal subscription ID
          // You can send this to your backend to activate/store the subscription
          console.log("Subscription approved!", data.subscriptionID);
          toast.success("Subscription Successful!", {
            description: "Your PayPal subscription was approved.",
            duration: 5000,
          });
        }}
        onError={(err) => {
          console.error("onError", err);
          toast.error("Subscription Error", {
            description:
              "There was an error processing your PayPal subscription.",
            duration: 5000,
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

const createSubscription = async () => {
  const res = await fetch("/api/paypal/subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (data.subscriptionId) {
    return data.subscriptionId; // PayPal will handle the redirect
  } else {
    throw new Error("Failed to create PayPal subscription. Please try again.");
  }
};

// const createOrder = async () => {
//   try {
//     const body: CreateOrderRequestBody = {
//       intent: "CAPTURE",
//       purchase_units: [
//         {
//           amount: {
//             currency_code: "EUR",
//             value: "0.01",
//           },
//         },
//       ],
//       payment_source: {
//         paypal: {
//           experience_context: {
//             shipping_preference: "NO_SHIPPING",
//           },
//           address: {
//             country_code: "AL",
//           },
//         },
//       },
//     };

//     const res = await fetch("api/order", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });
//     const data = (await res.json()) as OrderResponseBody;
//     return data.id as string;
//   } catch (error) {
//     console.error(error);
//     return ""; // TODO: handle error
//   }
// };
// const captureOrder = async ({ orderID }: OnApproveData) => {
//   try {
//     // TODO: add types
//     const body = {
//       orderID,
//     };
//     const res = await fetch(`api/order/${orderID}/capture`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });
//     const data = await res.json();
//     console.log("data", data);
//     return data.id;
//   } catch (error) {
//     console.error(error);
//   }
// };
