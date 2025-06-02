'use client';

import { useParams, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import SubMenu from '@/features/health-check/components/sub-menu';
import { useHealthCheck } from '@/features/health-check/hooks/use-health-check';
import { HealthCheckWithTeam } from '@/features/health-check/types/health-check';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamsByWorkspace } from '@/features/workspace/hooks/use-get-teams-by-workspace';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-get-workspace-user';
import { useWorkspaceStore } from '@/features/workspace/stores/workspace-store';
import { WorkspaceUserWithWorkspace } from '@/features/workspace/types/workspace-users';
import { useIsMobile } from '@/hooks/use-mobile';
import { Team } from '@/types/team';

import { AppSidebar } from './app-sidebar';
import { Header } from './header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const { currentWorkspace, setCurrentWorkspace, setCurrentTeam } =
    useWorkspaceStore();
  const { data: currentUser } = useCurrentUser();
  const isMobile = useIsMobile();

  // Route-based data fetching
  const isTeamRoute = pathname.startsWith('/teams/');
  const isHealthCheckRoute = pathname.startsWith('/health-checks/');
  const isWorkspaceRoute = pathname.startsWith('/workspaces/');

  const { data: workspaces, isLoading: isLoadingWorkspaces } =
    useGetWorkspaceUser(currentUser?.id || '');
  const { data: team, isLoading: isLoadingTeam } = useGetTeam(
    isTeamRoute ? params.id : '',
  );
  const { data: healthCheck, isLoading: isLoadingHealthCheck } = useHealthCheck(
    isHealthCheckRoute ? params.id : '',
  );
  const healthCheckData = healthCheck as HealthCheckWithTeam;

  // Determine current workspace ID
  const workspaceId = (() => {
    if (isWorkspaceRoute) return params.id as string;
    if (isTeamRoute && team) return team.workspace_id;
    if (isHealthCheckRoute && healthCheckData?.team?.workspace_id)
      return healthCheckData.team.workspace_id;
    return currentWorkspace?.workspace?.id;
  })();

  // Fetch teams for current workspace
  const { data: teams } = useGetTeamsByWorkspace(String(workspaceId), {
    enabled: !!workspaceId,
  });

  // Update workspace/team context based on route
  useEffect(() => {
    if (isLoadingWorkspaces || !workspaces) return;

    const updateContext = () => {
      if (isWorkspaceRoute) {
        const workspace = workspaces.find((w) => w.workspace?.id === params.id);
        if (workspace) {
          setCurrentWorkspace(workspace as WorkspaceUserWithWorkspace);
          setCurrentTeam(null);
        }
        return;
      }

      if (isTeamRoute && team) {
        const workspace = workspaces.find(
          (w) => w.workspace?.id === team.workspace_id,
        );
        if (workspace)
          setCurrentWorkspace(workspace as WorkspaceUserWithWorkspace);
        if (team) setCurrentTeam(team);
        return;
      }

      if (isHealthCheckRoute && healthCheckData?.team) {
        const workspace = workspaces.find(
          (w) => w.workspace?.id === healthCheckData.team.workspace_id,
        );
        const team = teams?.find((t) => t.id === healthCheckData.team.id);
        if (workspace)
          setCurrentWorkspace(workspace as WorkspaceUserWithWorkspace);
        if (team) setCurrentTeam(team);
      }
    };

    updateContext();
  }, [
    isWorkspaceRoute,
    isTeamRoute,
    isHealthCheckRoute,
    workspaces,
    teams,
    team,
    healthCheckData,
    params.id,
    isLoadingWorkspaces,
    setCurrentWorkspace,
    setCurrentTeam,
  ]);

  const isLoading =
    isLoadingWorkspaces ||
    (isTeamRoute && isLoadingTeam) ||
    (isHealthCheckRoute && isLoadingHealthCheck);

  if (isLoading) return <div>Loading...</div>;

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
        <main className="w-full">{children}</main>
      </SidebarInset>
      {!isMobile && isHealthCheckRoute && <SubMenu />}
    </SidebarProvider>
  );
}
