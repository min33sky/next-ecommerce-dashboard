import BillboardClient from '@/components/BillboardClient';
import { prisma } from '@/lib/db';
import React from 'react';
import { BillboardColumn } from './columns';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

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

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
}
