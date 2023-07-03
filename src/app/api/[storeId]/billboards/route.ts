import { prisma } from '@/lib/db';
import { BillboardValidator } from '@/lib/validators/bilboard';
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
        {
          message: '로그인이 필요합니다.',
        },
        {
          status: 401,
        },
      );
    }

    if (!storeId) {
      return NextResponse.json(
        {
          message: 'Store ID가 필요합니다.',
        },
        {
          status: 400,
        },
      );
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json(
        {
          message: '해당 Store를 찾을 수 없습니다.',
        },
        {
          status: 404,
        },
      );
    }

    const body = await req.json();

    const { imageUrl, label } = BillboardValidator.parse(body);

    const billboard = await prisma.billboard.create({
      data: {
        imageUrl,
        label,
        storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: '알 수 없는 에러가 발생했습니다.',
      },
      {
        status: 500,
      },
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
        {
          message: 'Store ID가 필요합니다.',
        },
        {
          status: 400,
        },
      );
    }

    const billboards = await prisma.billboard.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          'Billboards를 불러오는 과정에서 알 수 없는 에러가 발생했습니다.',
      },
      {
        status: 500,
      },
    );
  }
}
