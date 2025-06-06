'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useGetUserWorkspaces } from '@/features/workspace/hooks/use-get-user-workspaces';

export default function Home() {
  const router = useRouter();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: workspaces, isLoading: isLoadingWorkspaces } =
    useGetUserWorkspaces(currentUser?.id || '');

  useEffect(() => {
    if (!isLoadingUser && !isLoadingWorkspaces) {
      const firstWorkspace = workspaces?.[0];

      if (firstWorkspace) {
        router.push(`/workspaces/${firstWorkspace.workspace_id}`);
      } else {
        router.push('/workspaces/create');
      }
    }
  }, [isLoadingUser, isLoadingWorkspaces, workspaces, router]);

  if (isLoadingUser || isLoadingWorkspaces) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-lg">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return null;
}
