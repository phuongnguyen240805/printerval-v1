import { useState } from "react";
import { create } from "zustand";

interface SubscriptionModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSubscriptionModal = create<SubscriptionModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const usePaywall = () => {
  const { onOpen } = useSubscriptionModal();

  return {
    shouldBlock: false, // Mock - no paywall blocking
    triggerPaywall: () => onOpen(),
  };
};
