'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ModalType, useModal } from '@/app/hooks/useModal';

interface ModalProps {
  type: ModalType;
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({
  type,
  title,
  description,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  const { modalType } = useModal();

  if (modalType !== type) {
    return null;
  }

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <>{children}</>
      </DialogContent>
    </Dialog>
  );
}
