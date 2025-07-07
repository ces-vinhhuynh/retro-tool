'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import ActionItems from '@/features/health-check/components/action-items';
import { useGetActionItemsByTeamId } from '@/features/health-check/hooks/use-get-action-items-by-team-id';
import { useGetHealthChecksByTeam } from '@/features/health-check/hooks/use-get-healt-checks-by-team';
import { User } from '@/features/health-check/types/health-check';
import { WORKSPACE_ROLES } from '@/features/workspace/constants/user';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamMembers } from '@/features/workspace/hooks/use-get-team-member';
import { useGetTeamUser } from '@/features/workspace/hooks/use-get-team-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';

const TeamActionsPage = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const router = useRouter();

  // Data fetching for team actions
  const { data: actionItems = [] } = useGetActionItemsByTeamId(teamId);
  const { data: teamMembers = [] } = useGetTeamMembers(teamId);
  const { data: healthChecks = [] } = useGetHealthChecksByTeam(teamId);

  // User and team data
  const { data: team } = useGetTeam(teamId);
  const { data: currentUser } = useCurrentUser();

  const { error } = useGetTeamUser(teamId, currentUser?.id || '');
  const { data: workspaceUser } = useGetWorkspaceUser(
    team?.workspace_id || '',
    currentUser?.id || '',
  );

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
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
        <CardHeader>
          <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
            Team Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <ActionItems
            actionItems={actionItems}
            teamId={teamId}
            teamMembers={teamMembers as unknown as User[]}
            healthChecks={healthChecks}
            isHandlingOpenLink
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamActionsPage;
