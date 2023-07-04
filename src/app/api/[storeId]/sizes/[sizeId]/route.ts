import { prisma } from '@/lib/db';
import { SizeValidator } from '@/lib/validators/size';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  req: Request,
  {
    params: { sizeId },
  }: {
    params: {
      sizeId: string;
    };
  },
) {
  try {
    if (!sizeId) {
      return NextResponse.json(
        { message: 'sizeId가 필요합니다.' },
        { status: 400 },
      );
    }

    const size = await prisma.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    return NextResponse.json(
      {
        message: '사이즈 조회에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  {
    params: { sizeId, storeId },
  }: {
    params: {
      sizeId: string;
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

    if (!sizeId) {
      return NextResponse.json(
        { message: 'sizeId가 필요합니다.' },
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

    const size = await prisma.size.delete({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    return NextResponse.json(
      {
        message: '사이즈 삭제에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  {
    params: { sizeId, storeId },
  }: {
    params: {
      sizeId: string;
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

    if (!sizeId) {
      return NextResponse.json(
        { message: 'sizeId가 필요합니다.' },
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

    const { name, value } = SizeValidator.parse(body);

    const size = await prisma.size.update({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
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
        message: '사이즈 수정에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}
