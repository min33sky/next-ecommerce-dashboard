import { prisma } from '@/lib/db';
import { StoreValidator } from '@/lib/validators/store';
import { auth } from '@clerk/nextjs';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PATCH(
  req: Request,
  {
    params,
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

    if (!params.storeId) {
      return NextResponse.json(
        {
          message: 'storeId가 필요합니다.',
        },
        {
          status: 400,
        },
      );
    }

    const body = await req.json();

    const { name } = StoreValidator.parse(body);

    const store = await prisma.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store, {
      status: 200,
    });
  } catch (error) {
    console.log('### update Store Route Error: ', error);

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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          {
            message: '이미 존재하는 이름입니다.',
          },
          {
            status: 400,
          },
        );
      }
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

export async function DELETE(
  req: Request,
  {
    params,
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

    if (!params.storeId) {
      return NextResponse.json(
        {
          message: 'storeId가 필요합니다.',
        },
        {
          status: 400,
        },
      );
    }

    await prisma.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(
      {
        message: '삭제되었습니다.',
      },
      {
        status: 204,
      },
    );
  } catch (error) {
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
