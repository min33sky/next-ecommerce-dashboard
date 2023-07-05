import { prisma } from '@/lib/db';
import { ColorValidator } from '@/lib/validators/color';
import { ProductValidator } from '@/lib/validators/product';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  req: Request,
  {
    params: { productId },
  }: {
    params: {
      productId: string;
    };
  },
) {
  try {
    if (!productId) {
      return NextResponse.json(
        { message: 'productId가 필요합니다.' },
        { status: 400 },
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      {
        message: '상품 조회에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  {
    params: { productId, storeId },
  }: {
    params: {
      productId: string;
      storeId: string;
    };
  },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    if (!productId) {
      return NextResponse.json(
        { message: 'productId가 필요합니다.' },
        { status: 400 },
      );
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json(
        { message: '해당하는 storeId가 없습니다.' },
        { status: 404 },
      );
    }

    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      {
        message: '상품 삭제에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  {
    params: { productId, storeId },
  }: {
    params: {
      productId: string;
      storeId: string;
    };
  },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    if (!productId) {
      return NextResponse.json(
        { message: 'productId가 필요합니다.' },
        { status: 400 },
      );
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json(
        { message: '해당하는 storeId가 없습니다.' },
        { status: 404 },
      );
    }

    const body = await req.json();

    const {
      name,
      categoryId,
      colorId,
      images,
      price,
      sizeId,
      isArchived,
      isFeatured,
    } = ProductValidator.parse(body);

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        isArchived,
        isFeatured,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('### product update error : ', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: '상품 수정에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}
