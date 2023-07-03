import BillboardClient from '@/components/BillboardClient';
import { prisma } from '@/lib/db';
import React from 'react';

interface BillboardPageProps {
  params: {
    storeId: string;
  };
}

export default async function BillboardsPage({
  params,
}: BillboardPageProps): Promise<JSX.Element | null> {
  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={billboards} />
      </div>
    </div>
  );
}
