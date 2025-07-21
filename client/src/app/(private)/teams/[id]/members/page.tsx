'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { MembersTab } from '@/features/workspace/components/team-tabs/members-tab';
import {
  TEAM_ROLES,
  WORKSPACE_ROLES,
} from '@/features/workspace/constants/user';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamUser } from '@/features/workspace/hooks/use-get-team-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';

const MembersPage = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const router = useRouter();

  // User and team data
  const { data: team } = useGetTeam(teamId);
  const { data: currentUser } = useCurrentUser();

  const { data: teamUser, error } = useGetTeamUser(
    teamId,
    currentUser?.id || '',
  );
  const { data: workspaceUser } = useGetWorkspaceUser(
    team?.workspace_id || '',
    currentUser?.id || '',
  );

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
      <MembersTab
        teamId={teamId}
        isAdmin={isAdmin}
        currentUserRole={teamUser?.role as WORKSPACE_ROLES}
      />
    </div>
  );
};

export default MembersPage;
