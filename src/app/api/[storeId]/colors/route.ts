import { prisma } from '@/lib/db';
import { ColorValidator } from '@/lib/validators/color';
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

    const { name, value } = ColorValidator.parse(body);

    const color = await prisma.color.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      {
        message: '컬러 생성에 실패했습니다.',
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

    const colors = await prisma.color.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    return NextResponse.json(
      {
        message: '컬러 리스트 조회에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}
