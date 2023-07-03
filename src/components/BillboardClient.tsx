'use client';

import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import Heading from './Heading';
import { buttonVariants } from './ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import {
  BillboardColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/billboards/columns';
import { Separator } from './ui/separator';
import { DataTable } from './ui/data-table';
import ApiList from './ApiList';

interface BillboardClientProps {
  data: BillboardColumn[];
}

export default function BillboardClient({ data }: BillboardClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data?.length || 0})`}
          description="Manage billboards for your store"
        />
        <Link
          className={buttonVariants({
            variant: 'default',
          })}
          href={`/${params.storeId}/billboards/new`}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Link>
      </div>

      <Separator />

      <DataTable searchKey="label" data={data} columns={columns} />

      <Heading title="API" description="API for billboards" />

      <Separator />

      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
}
