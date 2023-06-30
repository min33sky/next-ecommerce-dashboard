import { z } from 'zod';

export const StoreValidator = z.object({
  name: z.string().min(2, {
    message: '최소 2글자 이상 입력해주세요.',
  }),
});

export type StoreRequest = z.infer<typeof StoreValidator>;
