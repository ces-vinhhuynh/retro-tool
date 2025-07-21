'use client';

import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { InviteHandler } from '@/features/workspace/components/invite-handler';
import { useGetTeamUserByToken } from '@/features/workspace/hooks/use-get-team-user-by-token';
import { useGetWorkspaceUserByToken } from '@/features/workspace/hooks/use-get-workspace-user-by-token';
import { useUpdateTeamUser } from '@/features/workspace/hooks/use-update-team-user';
import { useUpdateWorkspaceUser } from '@/features/workspace/hooks/use-update-workspace-user';
import { INVITATION_STATUS } from '@/features/workspace/utils/constant';

const TeamInvitePage = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceToken = searchParams.get('workspaceToken');
  const teamToken = searchParams.get('teamToken');

  const { data: teamUser, isLoading: isLoadingTeamUser } =
    useGetTeamUserByToken(teamToken ?? '');
  const { data: workspaceUser, isLoading: isLoadingWorkspaceUser } =
    useGetWorkspaceUserByToken(workspaceToken ?? '');
  const { mutate: updateTeamUser, isPending: isUpdatingTeamUser } =
    useUpdateTeamUser();
  const { mutate: updateWorkspaceUser, isPending: isUpdatingWorkspaceUser } =
    useUpdateWorkspaceUser();

  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (!workspaceToken || !teamToken) {
      setError('Invalid invitation link. Missing tokens.');
      return;
    }

    if (!teamUser || !workspaceUser) return;

    if (
      (workspaceUser.token_expires_at &&
        new Date(workspaceUser.token_expires_at) < new Date()) ||
      (teamUser.token_expires_at &&
        new Date(teamUser.token_expires_at) < new Date())
    ) {
      setError('Invitation link has expired.');
      return;
    }

    if (currentUser) {
      updateWorkspaceUser({
        id: workspaceUser.id,
        workspaceUser: {
          status: INVITATION_STATUS.ACCEPTED,
          user_id: currentUser.id,
          updated_at: new Date().toISOString(),
        },
      });

      updateTeamUser({
        id: teamUser.id,
        teamUser: {
          status: INVITATION_STATUS.ACCEPTED,
          user_id: currentUser.id,
          updated_at: new Date().toISOString(),
        },
      });

      router.push(`/teams/${teamUser.team_id}`);
    }
  }, [
    workspaceToken,
    teamToken,
    teamUser,
    workspaceUser,
    currentUser,
    updateTeamUser,
    updateWorkspaceUser,
    router,
  ]);

  const isLoading =
    isLoadingTeamUser ||
    isLoadingWorkspaceUser ||
    isUpdatingTeamUser ||
    isUpdatingWorkspaceUser;

  return <InviteHandler isLoading={isLoading} error={error} />;
};

// Wrap the TeamInvitePage in a Suspense boundary
const TeamInvitePageWithSuspense = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
            <p className="text-lg">Loading invitation...</p>
          </div>
        </div>
      }
    >
      <TeamInvitePage />
    </Suspense>
  );
};

export default TeamInvitePageWithSuspense;
