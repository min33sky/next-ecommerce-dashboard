import { create } from 'zustand';

export type ModalType = 'alert' | 'createStore';

interface ModalState {
  isOpen: boolean;
  modalType: ModalType | undefined;
  targetId?: string; //? 모달에 필요한 추가적인 정보가 있을 경우 (예: 삭제할 아이템의 id)
  onOpen: (type: ModalType, targetId?: string) => void;
  onClose: () => void;
}

export const useModal = create<ModalState>((set, get) => ({
  isOpen: false,
  modalType: undefined,
  onOpen: (type: ModalType, targetId?: string) =>
    set({
      modalType: type,
      isOpen: true,
      targetId,
    }),
  onClose: () =>
    set({
      modalType: undefined,
      isOpen: false,
      targetId: undefined,
    }),
}));
