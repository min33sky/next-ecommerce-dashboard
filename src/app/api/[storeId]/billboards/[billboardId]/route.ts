import { prisma } from '@/lib/db';
import { BillboardValidator } from '@/lib/validators/bilboard';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  req: Request,
  {
    params: { storeId, billboardId },
  }: {
    params: {
      storeId: string;
      billboardId: string;
    };
  },
) {
  try {
    if (!billboardId) {
      return NextResponse.json(
        {
          message: 'Billboard ID가 필요합니다.',
        },
        {
          status: 400,
        },
      );
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Billboard를 불러오는 도중 서버 에러가 발생했습니다.',
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
    params: { storeId, billboardId },
  }: {
    params: {
      storeId: string;
      billboardId: string;
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

    if (!billboardId) {
      return NextResponse.json(
        {
          message: 'Billboard ID가 필요합니다.',
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

    const billboard = await prisma.billboard.delete({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Billboard를 삭제하는 도중 서버 에러가 발생했습니다.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  req: Request,
  {
    params: { storeId, billboardId },
  }: {
    params: {
      storeId: string;
      billboardId: string;
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

    if (!billboardId) {
      return NextResponse.json(
        {
          message: 'Billboard ID가 필요합니다.',
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

    const billboard = await prisma.billboard.update({
      where: {
        id: billboardId,
      },
      data: {
        imageUrl,
        label,
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
        message: 'Billboard를 수정하는 도중 서버 에러가 발생했습니다.',
      },
      {
        status: 500,
      },
    );
  }
}
