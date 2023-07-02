import SettingsForm from '@/components/SettingsForm';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const store = await prisma.store.findFirst({
    where: {
      userId,
      id: params.storeId,
    },
  });

  if (!store) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
}
