'use client';

import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import Heading from './Heading';
import { Button, buttonVariants } from './ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function BillboardClient() {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Billboards [0]"
          description="Manage billboards for your store"
        />
        <Link
          className={buttonVariants({
            variant: 'outline',
          })}
          href={`/${params.storeId}/billboards/new`}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Link>
      </div>
    </>
  );
}
