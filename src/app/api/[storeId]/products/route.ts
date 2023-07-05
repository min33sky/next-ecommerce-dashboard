import { prisma } from '@/lib/db';
import { ProductValidator } from '@/lib/validators/product';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(
  req: Request,
  {
    params: { storeId },
  }: {
    params: {
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

    if (!storeId) {
      return NextResponse.json(
        { message: 'storeId가 필요합니다.' },
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

    const product = await prisma.product.create({
      data: {
        name,
        price,
        isArchived,
        isFeatured,
        categoryId,
        colorId,
        sizeId,
        storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      {
        message: '상품 생성에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}

export async function GET(
  req: Request,
  {
    params: { storeId },
  }: {
    params: {
      storeId: string;
    };
  },
) {
  try {
    if (!storeId) {
      return NextResponse.json(
        { message: 'storeId가 필요합니다.' },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    const products = await prisma.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: !!isFeatured || undefined,
        isArchived: false,
      },
      include: {
        images: true,
        color: true,
        size: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      {
        message: '상품 리스트 조회에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}
