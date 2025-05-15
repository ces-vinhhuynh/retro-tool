'use client';

import { redirect } from 'next/navigation';

import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-get-workspace-user';

export default function Home() {
  const { data: workspaces, isLoading } = useGetWorkspaceUser();

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
