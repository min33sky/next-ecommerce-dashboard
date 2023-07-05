'use client';

import {
  ProductColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/products/columns';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import Heading from './Heading';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Separator } from './ui/separator';
import { DataTable } from './ui/data-table';
import ApiList from './ApiList';

interface ProductClientProps {
  data: ProductColumn[];
}

export default function ProductClient({ data }: ProductClientProps) {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
}
