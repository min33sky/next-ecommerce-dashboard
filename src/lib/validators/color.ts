import { z } from 'zod';

export const ColorValidator = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' }),
  value: z
    .string()
    .min(4, { message: 'Value must be at least 4 characters long' })
    .max(9, { message: 'Value must be at most 9 characters long' })
    .regex(/^#/, { message: 'Value must start with #' }),
});

export type ColorRequest = z.infer<typeof ColorValidator>;
