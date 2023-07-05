'use client';

import { useModal } from '@/app/hooks/useModal';
import { ColorRequest, ColorValidator } from '@/lib/validators/color';
import { zodResolver } from '@hookform/resolvers/zod';
import { Color } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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

interface ColorFormProps {
  initialData: Color | null;
}

export default function ColorForm({ initialData }: ColorFormProps) {
  const params = useParams();
  const router = useRouter();
  const { onOpen, onClose } = useModal();

  const title = initialData ? 'Edit color' : 'Create color';
  const description = initialData ? 'Edit a color.' : 'Add a new color';
  const toastMessage = initialData ? 'Color updated.' : 'Color created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ColorRequest>({
    resolver: zodResolver(ColorValidator),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  });

  /**
   * @description
   * Mutation to create/update color
   */
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ name, value }: ColorRequest) => {
      const payload: ColorRequest = {
        name,
        value,
      };

      if (initialData) {
        //* Update API call
        const { data } = await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          payload,
        );
        return data;
      } else {
        //* Create API call
        const { data } = await axios.post(
          `/api/${params.storeId}/colors`,
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
        router.push(`/${params.storeId}/colors`);
        router.refresh();
      });
    },
  });

  /**
   * @description
   * Mutation to delete color
   */
  const { mutate: deleteColor, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/colors/${params.colorId}`,
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
        toast.success('Color deleted');
        onClose();
        router.push(`/${params.storeId}/colors`);
      });
    },
  });

  const onSubmit = (data: ColorRequest) => {
    console.log(data);
    mutate(data);
  };

  return (
    <>
      <AlertModal loading={isDeleteLoading} onConfirm={deleteColor} />

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
                      placeholder="Color name"
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
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isLoading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
