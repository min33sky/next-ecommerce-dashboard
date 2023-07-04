'use client';

import {
  CategoryColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/categories/columns';
import { useParams, useRouter } from 'next/navigation';
import React, { startTransition } from 'react';
import Heading from './Heading';
import { Button, buttonVariants } from './ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Separator } from './ui/separator';
import ApiList from './ApiList';
import { DataTable } from './ui/data-table';
import AlertModal from './modals/AlertModal';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useModal } from '@/app/hooks/useModal';

interface CategoryClientProps {
  data: CategoryColumn[];
}

export default function CategoryClient({ data }: CategoryClientProps) {
  const router = useRouter();
  const params = useParams();
  const { onClose, targetId } = useModal();

  /**
   * @description
   * Mutation to delete category
   */
  const { mutate: deleteCategory, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/categories/${targetId}`,
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
        toast.success('Category deleted');
        onClose();
        router.refresh();
      });
    },
  });

  return (
    <>
      <AlertModal loading={isDeleteLoading} onConfirm={deleteCategory} />

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
