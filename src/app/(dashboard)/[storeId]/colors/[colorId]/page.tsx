import ColorForm from '@/components/ColorForm';
import { prisma } from '@/lib/db';
import React from 'react';

interface ColorDetailPageProps {
  params: {
    colorId: string;
  };
}

export default async function ColorDetailPage({
  params,
}: ColorDetailPageProps) {
  const color = await prisma.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
}
