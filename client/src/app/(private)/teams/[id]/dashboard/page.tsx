'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useAgreementsQuery } from '@/features/health-check/hooks/agreements/use-agreements-query';
import { useIssuesQuery } from '@/features/health-check/hooks/issues/use-issues-query';
import { useGetActionItemsByTeamIdFromRecentHealthChecks } from '@/features/health-check/hooks/use-get-action-items-by-team-id';
import { HomeTab } from '@/features/workspace/components/team-tabs/home-tab';
import {
  TEAM_ROLES,
  WORKSPACE_ROLES,
} from '@/features/workspace/constants/user';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamUser } from '@/features/workspace/hooks/use-get-team-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';

const DashboardPage = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const router = useRouter();

  // Data fetching for dashboard
  const { data: actionItems = [] } =
    useGetActionItemsByTeamIdFromRecentHealthChecks(teamId, 2);
  const { data: agreements = [] } = useAgreementsQuery(teamId);
  const { data: issues = [] } = useIssuesQuery(teamId);

  // User and team data
  const { data: team } = useGetTeam(teamId);
  const { data: currentUser } = useCurrentUser();

  const { error } = useGetTeamUser(teamId, currentUser?.id || '');
  const { data: workspaceUser } = useGetWorkspaceUser(
    team?.workspace_id || '',
    currentUser?.id || '',
  );

  const { data: teamUser } = useGetTeamUser(teamId, currentUser?.id || '');

  const isAdmin =
    teamUser?.role === TEAM_ROLES.admin ||
    workspaceUser?.role === WORKSPACE_ROLES.owner ||
    workspaceUser?.role === WORKSPACE_ROLES.admin;

  // Permission check
  useEffect(() => {
    if (
      error &&
      workspaceUser?.role !== WORKSPACE_ROLES.owner &&
      workspaceUser?.role !== WORKSPACE_ROLES.admin
    ) {
      router.push(`/workspaces/${workspaceUser?.workspace_id}`);
    }
  }, [error, workspaceUser, router]);

  return (
    <div className="w-full p-4 md:p-6 lg:p-8">
      <HomeTab
        teamId={teamId}
        actionItems={actionItems}
        agreements={agreements}
        issues={issues}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default DashboardPage;
