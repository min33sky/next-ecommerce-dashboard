'use client';

import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { useModal } from './hooks/useModal';
import StoreModal from '@/components/modals/StoreModal';

export default function Home() {
  const { onOpen } = useModal();

  return (
    <main>
      <Button onClick={() => onOpen('createStore')}>Open Modal</Button>
      {/* <StoreModal /> */}
    </main>
  );
}
