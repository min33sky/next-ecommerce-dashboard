import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  modalType?: string;
  onOpen: () => void;
  onClose: () => void;
}

export const useModal = create<ModalState>((set, get) => ({
  isOpen: false,
  modalType: undefined,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
