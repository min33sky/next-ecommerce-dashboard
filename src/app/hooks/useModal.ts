import { create } from 'zustand';

export type ModalType = 'alert' | 'createStore';

interface ModalState {
  isOpen: boolean;
  modalType: ModalType | undefined;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<ModalState>((set, get) => ({
  isOpen: false,
  modalType: undefined,
  onOpen: (type: ModalType) =>
    set({
      modalType: type,
      isOpen: true,
    }),
  onClose: () =>
    set({
      modalType: undefined,
      isOpen: false,
    }),
}));
