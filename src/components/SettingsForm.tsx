'use client';

import { Store } from '@prisma/client';
import React, { startTransition } from 'react';
import Heading from './Heading';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
import { Separator } from './ui/separator';
import { useForm } from 'react-hook-form';
import { StoreRequest, StoreValidator } from '@/lib/validators/store';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { useModal } from '@/app/hooks/useModal';
import AlertModal from './modals/AlertModal';

interface SettingsFormProps {
  initialData: Store;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModal();

  const form = useForm<StoreRequest>({
    resolver: zodResolver(StoreValidator),
    defaultValues: {
      name: initialData.name,
    },
  });

  const { mutate: updateStore, isLoading: isUpdateLoading } = useMutation({
    mutationFn: async ({ name }: StoreRequest) => {
      const payload: StoreRequest = {
        name,
      };

      const { data } = await axios.patch(
        `/api/stores/${params.storeId}`,
        payload,
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
        toast.success('Store updated successfully');
        router.refresh();
      });
    },
  });

  const { mutate: deleteStore, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/stores/${params.storeId}`);
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
        toast.success('Store deleted successfully');
        router.push('/');
      });
    },
  });

  const onSubmit = (data: StoreRequest) => {
    updateStore(data);
  };

  return (
    <>
      <AlertModal loading={isDeleteLoading} onConfirm={deleteStore} />

      <div className="flex items-center justify-between">
        <Heading title="설정" description="스토어 기본 설정 관리" />
        <Button
          variant={'destructive'}
          size={'icon'}
          onClick={() => onOpen('alert')}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel htmlFor="store-name">이름</FormLabel>
                  <FormControl>
                    <Input
                      id="store-name"
                      disabled={isUpdateLoading}
                      placeholder="스토어 이름"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isUpdateLoading}
            isLoading={isUpdateLoading}
            className="ml-auto"
          >
            변경하기
          </Button>
        </form>
      </Form>
    </>
  );
}
