import BillboardForm from '@/components/BillboardForm';
import { prisma } from '@/lib/db';
import React from 'react';

interface BillboardDetailPageProps {
  params: {
    billboardId: string;
  };
}

export default async function BillboardDetailPage({
  params,
}: BillboardDetailPageProps) {
  const billboard = await prisma.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
}
