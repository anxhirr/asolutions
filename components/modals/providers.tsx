"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
} from "react";

import { useSubscriptionModal } from "./subscription-modal";

type StateSetter = Dispatch<SetStateAction<boolean>>;

export const ModalContext = createContext<{
  setShowSubscriptionModal: StateSetter;
}>({
  setShowSubscriptionModal: () => {},
});

export default function ModalProvider({ children }: { children: ReactNode }) {
  const { SubscriptionModal, setShowSubscriptionModal } =
    useSubscriptionModal();

  return (
    <ModalContext.Provider
      value={{
        setShowSubscriptionModal,
      }}
    >
      <SubscriptionModal />
      {children}
    </ModalContext.Provider>
  );
}

export const useModalCtx = () => useContext(ModalContext);
