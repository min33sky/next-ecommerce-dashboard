import { prisma } from '@/lib/db';
import { StoreValidator } from '@/lib/validators/store';
import { auth } from '@clerk/nextjs';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

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

    const { name } = StoreValidator.parse(body);

    const store = await prisma.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store, {
      status: 201,
    });
  } catch (error) {
    console.log('### create Store Route Error: ', error);

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
