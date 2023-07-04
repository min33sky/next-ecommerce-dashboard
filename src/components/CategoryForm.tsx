'use client';

import { useModal } from '@/app/hooks/useModal';
import { CategoryRequest, CategoryValidator } from '@/lib/validators/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard, Category } from '@prisma/client';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import AlertModal from './modals/AlertModal';

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

export default function CategoryForm({
  initialData,
  billboards,
}: CategoryFormProps) {
  const router = useRouter();
  const { onOpen, onClose } = useModal();
  const params = useParams();

  const title = initialData ? '카테고리 수정하기' : '카테고리 만들기';
  const description = initialData
    ? 'Edit your category'
    : 'Create a new category';
  const toastMessage = initialData ? 'Category updated' : 'Category created';
  const action = initialData ? 'Update' : 'Create';

  const form = useForm<CategoryRequest>({
    resolver: zodResolver(CategoryValidator),
    defaultValues: initialData || {
      name: '',
    },
  });

  /**
   * @description
   * Mutation to create/update category
   */
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ billboardId, name }: CategoryRequest) => {
      const payload: CategoryRequest = {
        billboardId,
        name,
      };

      if (initialData) {
        //* Update API call
        const { data } = await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          payload,
        );
        return data;
      } else {
        //* Create API call
        const { data } = await axios.post(
          `/api/${params.storeId}/categories`,
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
        router.push(`/${params.storeId}/categories`);
        router.refresh();
      });
    },
  });

  /**
   * @description
   * Mutation to delete category
   */
  const { mutate: deleteCategory, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`,
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
        router.push(`/${params.storeId}/categories`);
      });
    },
  });

  const onSubmit = (data: CategoryRequest) => {
    console.log(data);
    mutate(data);
  };

  return (
    <>
      {/* TODO: AlertModal */}
      <AlertModal loading={isDeleteLoading} onConfirm={deleteCategory} />

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
          <div className="grid grid-cols-3 gap8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Category Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={false}
                    onValueChange={field.onChange}
                    // value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          // defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Billboard</SelectLabel>
                        {billboards.map((billboard) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    <FormMessage />
                  </Select>
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
