'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import ActionItems from '@/features/health-check/components/action-items';
import { useGetActionItemsByTeamId } from '@/features/health-check/hooks/use-get-action-items-by-team-id';
import { useGetHealthChecksByTeam } from '@/features/health-check/hooks/use-get-healt-checks-by-team';
import { User } from '@/features/health-check/types/health-check';
import {
  TEAM_ROLES,
  WORKSPACE_ROLES,
} from '@/features/workspace/constants/user';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamMembers } from '@/features/workspace/hooks/use-get-team-member';
import { useGetTeamUser } from '@/features/workspace/hooks/use-get-team-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';

const TeamActionsPage = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const router = useRouter();

  const [mode, setMode] = useState('open');

  // Data fetching for team actions
  const { data: actionItems = [] } = useGetActionItemsByTeamId(teamId);

  const { data: teamMembers = [] } = useGetTeamMembers(teamId);
  const { data: healthChecks = [] } = useGetHealthChecksByTeam(teamId);

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

  const openAndInprogressActions = actionItems.filter(
    ({ status }) => status === 'todo' || status === 'in_progress',
  );
  const doneActions = actionItems.filter(({ status }) => status === 'done');
  const blockActions = actionItems.filter(({ status }) => status === 'blocked');

  return (
    <div className="w-full p-4 md:p-6 lg:p-8">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
              Team Actions
            </CardTitle>
            <p className="text-secondary-text text-sm">
              {openAndInprogressActions.length}/{actionItems.length} Todo & In
              progress from 2 recent sprint
            </p>
          </div>
          {mode === 'open' && (
            <Button
              variant="outline"
              onClick={() => setMode('done')}
            >{`${doneActions.length}/${actionItems.length} Completed`}</Button>
          )}
          {mode === 'done' && (
            <Button
              variant="outline"
              onClick={() => setMode('block')}
            >{`${blockActions.length}/${actionItems.length} Blocked`}</Button>
          )}
          {mode === 'block' && (
            <Button variant="outline" onClick={() => setMode('open')}>
              {`${doneActions.length}/${actionItems.length} Open`}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          <ActionItems
            actionItems={
              mode === 'open'
                ? openAndInprogressActions
                : mode === 'done'
                  ? doneActions
                  : blockActions
            }
            teamId={teamId}
            teamMembers={teamMembers as unknown as User[]}
            healthChecks={healthChecks}
            isHandlingOpenLink
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamActionsPage;
