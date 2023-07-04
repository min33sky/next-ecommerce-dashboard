import CategoryForm from '@/components/CategoryForm';
import { prisma } from '@/lib/db';
import React from 'react';

interface CategoryDetailPageProps {
  params: {
    categoryId: string;
    storeId: string;
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
}
