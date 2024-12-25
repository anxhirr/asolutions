import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { DollarSign } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Modal } from "@/components/ui/modal";

import { CheckoutForm } from "../forms/checkout-form";

function SubscriptionModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-secondary px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <DollarSign />
          </a>
          <h3 className="font-urban text-2xl font-bold">Payment method</h3>
          <p className="text-sm text-gray-500">
            Choose a payment method to continue
          </p>
        </div>

        <div className="flex flex-col space-y-4 bg-secondary/50 p-8">
          <CheckoutForm />
        </div>
      </div>
    </Modal>
  );
}

export function useSubscriptionModal() {
  const [showModal, setShowModal] = useState(false);

  const SubscriptionModalCallback = useCallback(() => {
    return (
      <SubscriptionModal showModal={showModal} setShowModal={setShowModal} />
    );
  }, [showModal, setShowModal]);

  return useMemo(
    () => ({
      setShowSubscriptionModal: setShowModal,
      SubscriptionModal: SubscriptionModalCallback,
    }),
    [setShowModal, SubscriptionModalCallback],
  );
}
