import { z } from 'zod';

export const SizeValidator = z.object({
  name: z
    .string()
    .min(1, { message: 'Name must be at least 1 character long' }),
  value: z
    .string()
    .min(1, { message: 'Value must be at least 1 character long' }),
});

export type SizeRequest = z.infer<typeof SizeValidator>;
