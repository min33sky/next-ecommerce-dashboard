'use client';

import {
  ColorColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/colors/column';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import Heading from './Heading';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Separator } from './ui/separator';
import { DataTable } from './ui/data-table';
import ApiList from './ApiList';

interface ColorClientProps {
  data: ColorColumn[];
}

export default function ColorClient({ data }: ColorClientProps) {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage colors for your products"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
}
