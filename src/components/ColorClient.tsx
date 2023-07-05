'use client';

import {
  ColorColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/colors/column';
import { useParams, useRouter } from 'next/navigation';
import React, { startTransition } from 'react';
import Heading from './Heading';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Separator } from './ui/separator';
import { DataTable } from './ui/data-table';
import ApiList from './ApiList';
import { useModal } from '@/app/hooks/useModal';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import AlertModal from './modals/AlertModal';

interface ColorClientProps {
  data: ColorColumn[];
}

export default function ColorClient({ data }: ColorClientProps) {
  const params = useParams();
  const router = useRouter();
  const { onClose, targetId } = useModal();

  /**
   * @description
   * Mutation to delete color
   */
  const { mutate: deleteColor, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/colors/${targetId}`,
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
        toast.success('Size deleted');
        onClose();
        router.refresh();
      });
    },
  });

  return (
    <>
      <AlertModal loading={isDeleteLoading} onConfirm={deleteColor} />

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
