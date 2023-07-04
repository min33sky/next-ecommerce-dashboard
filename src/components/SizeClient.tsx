import { SizeColumn, columns } from '@/app/(dashboard)/[storeId]/sizes/columns';
import { useParams, useRouter } from 'next/navigation';
import React, { startTransition } from 'react';
import Heading from './Heading';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Plus } from 'lucide-react';
import { DataTable } from './ui/data-table';
import ApiList from './ApiList';
import { useModal } from '@/app/hooks/useModal';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AlertModal from './modals/AlertModal';

interface SizesClientProps {
  data: SizeColumn[];
}

export default function SizeClient({ data }: SizesClientProps) {
  const params = useParams();
  const router = useRouter();
  const { onClose, targetId } = useModal();

  /**
   * @description
   * Mutation to delete size
   */
  const { mutate: deleteSize, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/sizes/${targetId}`,
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
      <AlertModal loading={isDeleteLoading} onConfirm={deleteSize} />

      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage sizes for your products"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
}
