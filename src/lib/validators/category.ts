import { z } from 'zod';

export const CategoryValidator = z.object({
  name: z.string().min(1, { message: '카테고리 이름을 입력해주세요.' }),
  billboardId: z.string().min(1, { message: 'Billboard ID를 입력해주세요.' }),
});

export type CategoryRequest = z.infer<typeof CategoryValidator>;
