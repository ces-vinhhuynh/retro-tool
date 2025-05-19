'use client';

import { useParams } from 'next/navigation';
import { ReactNode } from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useGetTeamsByWorkspace } from '@/features/workspace/hooks/use-get-teams-by-workspace';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-get-workspace-user';
import { Team } from '@/features/workspace/types/team';
import { WorkspaceUserWithWorkspace } from '@/features/workspace/types/workspace-users';

import { AppSidebar } from './app-sidebar';
import { Header } from './header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const params = useParams();
  const { data: currentUser } = useCurrentUser();
  const { data: workspaces, isLoading: isLoadingWorkspaces } =
    useGetWorkspaceUser(currentUser?.id || '');

  const currentWorkspace = workspaces?.find(
    (workspace) => workspace?.workspace?.id === String(params.id),
  );

  const { data: teams, isLoading: isLoadingTeams } = useGetTeamsByWorkspace(
    String(currentWorkspace?.workspace?.id),
    {
      enabled: !!currentWorkspace,
    },
  );

  if (isLoadingWorkspaces || isLoadingTeams || isLoadingTeams) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar
        workspaces={workspaces as WorkspaceUserWithWorkspace[]}
        currentWorkspace={currentWorkspace as WorkspaceUserWithWorkspace}
        teams={teams as Team[]}
      />
      <SidebarInset>
        <Header
          currentWorkspace={currentWorkspace as WorkspaceUserWithWorkspace}
        />
        <main className="container mx-auto max-w-screen-2xl flex-grow">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
