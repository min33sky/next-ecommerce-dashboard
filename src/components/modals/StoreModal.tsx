'use client';

import { useModal } from '@/app/hooks/useModal';
import React from 'react';
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

type FormType = z.infer<typeof StoreValidator>;

export default function StoreModal() {
  const form = useForm<FormType>({
    resolver: zodResolver(StoreValidator),
    defaultValues: {
      name: '',
    },
  });

  const { isOpen, onClose } = useModal();

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
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

              <DialogFooter className="pt-6 space-x-2 flex items-center justify-end">
                <Button type="button" variant={'outline'} onClick={onClose}>
                  취소
                </Button>
                <Button type="submit">계속</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
