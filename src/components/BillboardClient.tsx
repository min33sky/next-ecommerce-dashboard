'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { startTransition } from 'react';
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
import AlertModal from './modals/AlertModal';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useModal } from '@/app/hooks/useModal';

interface BillboardClientProps {
  data: BillboardColumn[];
}

export default function BillboardClient({ data }: BillboardClientProps) {
  const router = useRouter();
  const params = useParams();
  const { onOpen, onClose, targetId } = useModal();

  /**
   * @description
   * Mutation to delete billboard
   */
  const { mutate: deleteBillboard, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/billboards/${targetId}`,
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }

      toast.error('Something went wrong');
    },
    onSuccess: (data) => {
      startTransition(() => {
        toast.success('Billboard deleted');
        onClose();
        router.refresh();
      });
    },
  });

  return (
    <>
      <AlertModal loading={isDeleteLoading} onConfirm={deleteBillboard} />

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
