'use client';

import {
  BillboardRequest,
  BillboardValidator,
} from '@/lib/validators/bilboard';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import React, { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import Heading from './Heading';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
import { Separator } from './ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import ImageUpload from './ImageUpload';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import AlertModal from './modals/AlertModal';

interface BillboardFormProps {
  initialData: Billboard | null;
}

export default function BillboardForm({ initialData }: BillboardFormProps) {
  const router = useRouter();
  const params = useParams();

  const title = initialData ? 'Edit Billboard' : 'New Billboard';
  const description = initialData
    ? 'Edit your billboard'
    : 'Create a new billboard';
  const toastMessage = initialData ? 'Billboard updated' : 'Billboard created';
  const action = initialData ? 'Update' : 'Create';

  const form = useForm<BillboardRequest>({
    resolver: zodResolver(BillboardValidator),
    defaultValues: initialData || {
      imageUrl: '',
      label: '',
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ imageUrl, label }: BillboardRequest) => {
      const payload: BillboardRequest = {
        imageUrl,
        label,
      };

      if (initialData) {
        //* Update API call
        const { data } = await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          payload,
        );
        return data;
      } else {
        //* Create API call
        const { data } = await axios.post(
          `/api/${params.storeId}/billboards`,
          payload,
        );
        return data;
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }

      toast.error('Something went wrong');
    },
    onSuccess: (data) => {
      startTransition(() => {
        toast.success(toastMessage);
        router.push(`/${params.storeId}/billboards`);
      });
    },
  });

  const { mutate: deleteBillboard, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`,
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
        router.push(`/${params.storeId}/billboards`);
      });
    },
  });

  const onSubmit = async (data: BillboardRequest) => {
    console.log('FormData: ', data);
    mutate(data);
  };

  return (
    <>
      <AlertModal loading={isDeleteLoading} onConfirm={deleteBillboard} />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={'destructive'}
            size={'icon'}
            onClick={() => alert('삭제 구현 예정')}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="imageUrl">Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={false}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="label">Label</FormLabel>
                  <FormControl>
                    <Input
                      id="label"
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
