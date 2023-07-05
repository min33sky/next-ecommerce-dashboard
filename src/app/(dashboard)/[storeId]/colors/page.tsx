import { prisma } from '@/lib/db';
import React from 'react';
import { ColorColumn } from './column';
import { format } from 'date-fns';
import ColorClient from '@/components/ColorClient';

interface ColorsPageProps {
  params: {
    storeId: string;
  };
}

export default async function ColorsPage({ params }: ColorsPageProps) {
  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
}
