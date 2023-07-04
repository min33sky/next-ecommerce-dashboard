'use client';

import { useModal } from '@/app/hooks/useModal';
import { SizeRequest, SizeValidator } from '@/lib/validators/size';
import { zodResolver } from '@hookform/resolvers/zod';
import { Size } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import React, { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import AlertModal from './modals/AlertModal';
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
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface SizeFormProps {
  initialData: Size | null;
}

export default function SizeForm({ initialData }: SizeFormProps) {
  const params = useParams();
  const router = useRouter();
  const { onOpen, onClose } = useModal();

  const title = initialData ? 'Edit size' : 'Create size';
  const description = initialData ? 'Edit a size.' : 'Add a new size';
  const toastMessage = initialData ? 'Size updated.' : 'Size created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<SizeRequest>({
    resolver: zodResolver(SizeValidator),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  });

  /**
   * @description
   * Mutation to create/update size
   */
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ name, value }: SizeRequest) => {
      const payload: SizeRequest = {
        name,
        value,
      };

      if (initialData) {
        //* Update API call
        const { data } = await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          payload,
        );
        return data;
      } else {
        //* Create API call
        const { data } = await axios.post(
          `/api/${params.storeId}/sizes`,
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
        router.push(`/${params.storeId}/sizes`);
        router.refresh();
      });
    },
  });

  /**
   * @description
   * Mutation to delete size
   */
  const { mutate: deleteSize, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/sizes/${params.sizeId}`,
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
        router.push(`/${params.storeId}/sizes`);
      });
    },
  });

  const onSubmit = (data: SizeRequest) => {
    console.log(data);
    mutate(data);
  };

  return (
    <>
      <AlertModal loading={isDeleteLoading} onConfirm={deleteSize} />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={'destructive'}
            size={'icon'}
            onClick={() => onOpen('alert')}
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
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={false}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={false}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={false} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
