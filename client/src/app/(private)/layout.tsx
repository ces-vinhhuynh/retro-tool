'use client';

import { useParams, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useHealthCheck } from '@/features/health-check/hooks/use-health-check';
import { HealthCheckWithTeam } from '@/features/health-check/types/health-check';
import { WORKSPACE_ROLES } from '@/features/workspace/constants/user';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamsByWorkspace } from '@/features/workspace/hooks/use-get-teams-by-workspace';
import { useGetTeamsByWorkspaceAndUser } from '@/features/workspace/hooks/use-get-teams-by-workspace-and-user';
import { useGetUserWorkspaces } from '@/features/workspace/hooks/use-get-user-workspaces';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';
import { useWorkspaceStore } from '@/features/workspace/stores/workspace-store';
import { WorkspaceUserWithWorkspace } from '@/features/workspace/types/workspace-users';
import { Team } from '@/types/team';

import { AccessDenied } from '../auth/error/access-denied';

interface PrivateLayoutProps {
  children: ReactNode;
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const { currentWorkspace, setCurrentWorkspace, currentTeam, setCurrentTeam } =
    useWorkspaceStore();
  const { data: currentUser } = useCurrentUser();

  // Route-based data fetching
  const isTeamRoute = pathname.startsWith('/teams/');
  const isHealthCheckRoute = pathname.startsWith('/health-checks/');
  const isWorkspaceRoute = pathname.startsWith('/workspaces/');
  const isCreateWorkspaceRoute = pathname.startsWith('/workspaces/create');

  const { data: workspaces, isLoading: isLoadingWorkspaces } =
    useGetUserWorkspaces(currentUser?.id || '');
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
  const { data: teamsByMember = [], isLoading: isLoadingTeamsByMember } =
    useGetTeamsByWorkspaceAndUser(workspaceId || '', currentUser?.id || '');
  const { data: teamsByAdmin = [], isLoading: isLoadingTeamsByAdmin } =
    useGetTeamsByWorkspace(workspaceId || '', {
      enabled: !!workspaceId,
    });
  const { data: workspaceUser, isLoading: isLoadingWorkspaceUser } =
    useGetWorkspaceUser(workspaceId || '', currentUser?.id || '');

  const isOwnerOrAdmin =
    workspaceUser?.role === WORKSPACE_ROLES.owner ||
    workspaceUser?.role === WORKSPACE_ROLES.admin;
  const teams = isOwnerOrAdmin ? teamsByAdmin : teamsByMember;

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
        if (team) setCurrentTeam(team as unknown as Team);
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
    isLoadingTeam ||
    isLoadingTeamsByMember ||
    isLoadingHealthCheck ||
    isLoadingTeamsByAdmin ||
    isLoadingWorkspaceUser;

  if (isLoading) return <div>Loading...</div>;

  if (isWorkspaceRoute && !workspaceUser && !isCreateWorkspaceRoute) {
    return (
      <AccessDenied
        message="You don't have permission to view this workspace. Please contact your admin(s) or your workspace owner(s) to request access."
        redirectUrl="/"
        linkText="Go to Workspace"
      />
    );
  }

  if (isTeamRoute && teamsByMember.length === 0) {
    return (
      <AccessDenied
        message="You don't have permission to view this team data. Only workspace owners and admins can access this page."
        redirectUrl="/"
        linkText="Go to Workspace"
      />
    );
  }

  if (isHealthCheckRoute && !workspaceUser) {
    return (
      <AccessDenied
        message={`You don't have permission to view this healthy check data.
            Please contact your admin(s) or your workspace owner(s) to request access.`}
        redirectUrl="/"
        linkText="Go to Workspace"
      />
    );
  }

  return (
    <SidebarProvider>
      {isCreateWorkspaceRoute || (
        <AppSidebar
          workspaces={workspaces as WorkspaceUserWithWorkspace[]}
          currentWorkspace={currentWorkspace as WorkspaceUserWithWorkspace}
          teams={teams as unknown[] as Team[]}
          currentTeam={currentTeam as Team}
          isOwnerOrAdmin={isOwnerOrAdmin}
        />
      )}
      <SidebarInset>
        {isCreateWorkspaceRoute || (
          <Header
            currentWorkspace={currentWorkspace as WorkspaceUserWithWorkspace}
            currentTeam={currentTeam as Team}
          />
        )}
        <main className="w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PrivateLayout;
