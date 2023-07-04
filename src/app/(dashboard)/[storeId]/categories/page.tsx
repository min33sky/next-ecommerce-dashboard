import { prisma } from '@/lib/db';
import React from 'react';
import { CategoryColumn } from './columns';
import { format } from 'date-fns';
import CategoryClient from '@/components/CategoryClient';

interface CategoriesPageProps {
  params: {
    storeId: string;
  };
}

export default async function CategoriesPage({
  params: { storeId },
}: CategoriesPageProps) {
  const categories = await prisma.category.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      billboard: true,
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
}
