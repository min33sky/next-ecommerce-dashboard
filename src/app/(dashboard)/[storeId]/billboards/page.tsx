import BillboardClient from '@/components/BillboardClient';
import React from 'react';

export default function BillboardsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient />
      </div>
    </div>
  );
}
