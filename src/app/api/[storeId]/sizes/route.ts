import { prisma } from '@/lib/db';
import { SizeValidator } from '@/lib/validators/size';
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

    const { name, value } = SizeValidator.parse(body);

    const size = await prisma.size.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      {
        message: '사이즈 생성에 실패했습니다.',
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

    const sizes = await prisma.size.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    return NextResponse.json(
      {
        message: '사이즈 조회에 실패했습니다.',
      },
      { status: 500 },
    );
  }
}
