import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const store = await prisma.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    return redirect(`/${store.id}`);
  }

  return (
    <main>
      <h1>현재 Store가 없어요</h1>
    </main>
  );
}
