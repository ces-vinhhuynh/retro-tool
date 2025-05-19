'use client';

import { redirect } from 'next/navigation';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-get-workspace-user';

export default function Home() {
  const { data: currentUser } = useCurrentUser();
  const { data: workspaces, isLoading } = useGetWorkspaceUser(
    currentUser?.id || '',
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const firstWorkspace = workspaces?.[0];

  // TODO: Redirect to exactly the workspace user wants to go to

  redirect(
    firstWorkspace
      ? `/workspaces/${firstWorkspace.workspace_id}`
      : '/workspaces/create',
  );
}
