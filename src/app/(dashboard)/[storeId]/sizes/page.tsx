import { prisma } from '@/lib/db';
import React from 'react';
import { SizeColumn } from './columns';
import { format } from 'date-fns';
import SizeClient from '@/components/SizeClient';

interface SizesPageProps {
  params: {
    storeId: string;
  };
}

export default async function SizesPage({ params }: SizesPageProps) {
  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
}
