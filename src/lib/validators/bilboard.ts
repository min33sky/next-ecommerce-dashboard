import { z } from 'zod';

export const BillboardValidator = z.object({
  label: z.string().min(2, {
    message: '최소 2글자 이상 입력해주세요.',
  }),
  imageUrl: z.string().url({
    message: '올바른 URL을 입력해주세요.',
  }),
});

export type BillboardRequest = z.infer<typeof BillboardValidator>;
