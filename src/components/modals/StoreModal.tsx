'use client';

import { useModal } from '@/app/hooks/useModal';
import React, { startTransition } from 'react';
import Modal from '../Modal';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { StoreValidator } from '@/lib/validators/store';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Store } from '@prisma/client';
import { useRouter } from 'next/navigation';

type FormType = z.infer<typeof StoreValidator>;

export default function StoreModal() {
  const router = useRouter();
  const { isOpen, onClose } = useModal();

  const form = useForm<FormType>({
    resolver: zodResolver(StoreValidator),
    defaultValues: {
      name: '',
    },
  });

  const { mutate: createStore, isLoading } = useMutation({
    mutationFn: async ({ name }: FormType) => {
      const payload: FormType = {
        name,
      };

      const { data } = await axios.post<Store>('/api/store', payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }
      toast.error('Something went wrong');
    },
    onSuccess: (data) => {
      console.log(data);
      startTransition(() => {
        toast.success('Store created successfully');
        onClose();
        router.push(`/${data.id}`);
      });
    },
  });

  const onSubmit = (data: FormType) => {
    console.log(data);

    createStore(data);
  };

  return (
    <Modal
      title="스토어 생성하기"
      description="상품들과 카테코리를 관리할 수 있는 스토어를 생성하세요."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">이름</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="E-Commerce" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-6">
                <Button
                  type="button"
                  disabled={isLoading}
                  variant={'outline'}
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                  isLoading={isLoading}
                >
                  계속
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
