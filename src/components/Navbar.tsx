import { UserButton, auth } from '@clerk/nextjs';
import React from 'react';
import MainNav from './MainNav';
import StoreSwitcher from './StoreSwitcher';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ModeToggle } from './ThemeToggle';

export default async function Navbar() {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const stores = await prisma.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex items-center h-16 px-4">
        <StoreSwitcher items={stores} />

        <MainNav className="mx-6" />

        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
