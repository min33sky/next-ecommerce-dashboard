'use client';

import React from 'react';
import Modal from '../Modal';
import { DialogFooter } from '../ui/dialog';
import { useModal } from '@/app/hooks/useModal';
import { Button } from '../ui/button';

interface AlertModalProps {
  onConfirm: () => void;
  loading?: boolean;
}

export default function AlertModal({ onConfirm, loading }: AlertModalProps) {
  const { isOpen, onClose } = useModal();

  return (
    <Modal
      type="alert"
      title="Are you sure?"
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <DialogFooter className="pt-6">
        <Button disabled={loading} variant={'outline'} onClick={onClose}>
          취소
        </Button>
        <Button
          disabled={loading}
          isLoading={loading}
          variant={'destructive'}
          onClick={onConfirm}
        >
          확인
        </Button>
      </DialogFooter>
    </Modal>
  );
}
