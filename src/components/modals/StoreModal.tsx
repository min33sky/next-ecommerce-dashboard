'use client';

import { useModal } from '@/app/hooks/useModal';
import React from 'react';
import Modal from '../Modal';

export default function StoreModal() {
  const { isOpen, onClose } = useModal();

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      스토어 생성 폼
    </Modal>
  );
}
