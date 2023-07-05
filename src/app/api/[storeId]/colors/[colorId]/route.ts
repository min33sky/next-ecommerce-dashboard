import { prisma } from '@/lib/db';
import { ColorValidator } from '@/lib/validators/color';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  req: Request,
  {
    params: { colorId },
  }: {
    params: {
      colorId: string;
    };
  },
) {
  try {
    if (!colorId) {
      return NextResponse.json(
        { message: 'colorId가 필요합니다.' },
        { status: 400 },
      );
    }

    const color = await prisma.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    return NextResponse.json(
      {
        message: '색상 조회에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  {
    params: { colorId, storeId },
  }: {
    params: {
      colorId: string;
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

    if (!colorId) {
      return NextResponse.json(
        { message: 'colorId가 필요합니다.' },
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

    const color = await prisma.color.delete({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    return NextResponse.json(
      {
        message: '색상 삭제에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  {
    params: { colorId, storeId },
  }: {
    params: {
      colorId: string;
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

    if (!colorId) {
      return NextResponse.json(
        { message: 'colorId가 필요합니다.' },
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

    const { name, value } = ColorValidator.parse(body);

    const color = await prisma.color.update({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
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
        message: '색상 수정에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}
