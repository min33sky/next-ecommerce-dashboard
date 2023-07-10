import { prisma } from '@/lib/db';

export const getSalesCount = async (storeId: string) => {
  const salesCount = await prisma.order.count({
    where: {
      storeId,
      isPaid: true, //! 실제로는 true로 바꿔야 함 (webhook에서 true로 바꾸게 처리해야함)
    },
  });

  return salesCount;
};
