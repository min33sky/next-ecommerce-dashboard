'use client';

import {
  CategoryColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/categories/columns';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import Heading from './Heading';
import { Button, buttonVariants } from './ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Separator } from './ui/separator';
import ApiList from './ApiList';
import { DataTable } from './ui/data-table';

interface CategoryClientProps {
  data: CategoryColumn[];
}

export default function CategoryClient({ data }: CategoryClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      {/* TODO: AlertModal */}

      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />
        <Link
          className={buttonVariants({
            variant: 'default',
          })}
          href={`/${params.storeId}/categories/new`}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Link>
      </div>

      <Separator />

      <DataTable searchKey="name" data={data} columns={columns} />

      <Heading title="API" description="API for categories" />

      <Separator />

      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
}
