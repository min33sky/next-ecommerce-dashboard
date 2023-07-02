import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  params: {
    storeId: string;
  };
}

export default async function DashboardPage({ params: { storeId } }: Props) {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  //? 일단 주석처리
  // const store = await prisma.store.findFirst({
  //   where: {
  //     userId,
  //     id: storeId,
  //   },
  // });

  // if (!store) {
  //   return redirect('/');
  // }

  return <div className="">DashboardPage : {storeId}</div>;
}
