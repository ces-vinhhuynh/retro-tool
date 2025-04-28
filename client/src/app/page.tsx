'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';

export default function Home() {
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { logout } = useAuth();

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <span className={userLoading ? 'opacity-0' : 'opacity-100'}>
          <div>
            <h1>Welcome {currentUser?.email}</h1>
            <Button onClick={() => logout()}>Sign out</Button>
          </div>
        </span>
        {userLoading && <Skeleton className="absolute inset-0" />}
      </main>
    </div>
  );
}
