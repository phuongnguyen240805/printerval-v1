import { create } from "zustand";

interface SuccessModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSuccessModal = create<SuccessModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
