import { z } from 'zod';

export const ProductValidator = z.object({
  name: z
    .string()
    .min(1, { message: 'Name must be at least 1 characters long' }),
  images: z
    .object({
      url: z.string(),
    })
    .array(),
  price: z.coerce.number().min(1, { message: 'Price must be at least 1' }),
  categoryId: z
    .string()
    .min(1, { message: 'categoryId must be at least 1 characters long' }),
  colorId: z
    .string()
    .min(1, { message: 'colorId must be at least 1 characters long' }),
  sizeId: z
    .string()
    .min(1, { message: 'sizeId must be at least 1 characters long' }),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

export type ProductRequest = z.infer<typeof ProductValidator>;
