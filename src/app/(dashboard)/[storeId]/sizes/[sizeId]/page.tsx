import SizeForm from '@/components/SizeForm';
import { prisma } from '@/lib/db';
import React from 'react';

interface SizeDetailPageProps {
  params: {
    sizeId: string;
  };
}

export default async function SizeDetailPage({
  params: { sizeId },
}: SizeDetailPageProps) {
  const size = await prisma.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
}
