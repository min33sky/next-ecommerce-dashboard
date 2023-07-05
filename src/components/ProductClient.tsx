'use client';

import {
  ProductColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/products/columns';
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

interface ProductClientProps {
  data: ProductColumn[];
}

export default function ProductClient({ data }: ProductClientProps) {
  const params = useParams();
  const router = useRouter();
  const { onClose, targetId } = useModal();

  /**
   * @description
   * Mutation to delete product
   */
  const { mutate: deleteProduct, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/products/${targetId}`,
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
        toast.success('Product deleted');
        onClose();
        router.refresh();
      });
    },
  });

  return (
    <>
      <AlertModal loading={isDeleteLoading} onConfirm={deleteProduct} />

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
