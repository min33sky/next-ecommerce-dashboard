'use client';

import { Button } from '@/components/ui/button';
import { useModal } from './hooks/useModal';

export default function Home() {
  const { onOpen } = useModal();

  return (
    <main>
      <Button onClick={() => onOpen('createStore')}>Open Modal</Button>
      {/* <StoreModal /> */}
    </main>
  );
}
