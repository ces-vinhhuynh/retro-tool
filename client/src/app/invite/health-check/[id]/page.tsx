'use client';
import { isArray } from 'lodash';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useHealthCheck } from '@/features/health-check/hooks/use-health-check';
import { useGetTeamMembers } from '@/features/workspace/hooks/use-get-team-member';
import { useGetWorkspaceMembers } from '@/features/workspace/hooks/use-get-workspace-members';
import { useInviteUserToTeam } from '@/features/workspace/hooks/use-invite-user-to-team';

const TeamInvitePage = () => {
  const { id: healthCheckId } = useParams<{ id: string }>();
  const router = useRouter();

  const [isValid, setIsValid] = useState<boolean>(true);

  const { data: currentUser } = useCurrentUser();

  const { data: healthCheck } = useHealthCheck(healthCheckId);

  const { data: teamMembers } = useGetTeamMembers(healthCheck?.team_id || '');
  const { data: workspaceMembers } = useGetWorkspaceMembers(
    healthCheck?.team?.workspace_id || '',
  );

  const { mutate: inviteUserToTeam } = useInviteUserToTeam();

  useEffect(() => {
    if (!isArray(workspaceMembers) || !isArray(teamMembers)) return;

    const run = async () => {
      const isWorkspaceMember = workspaceMembers?.some(
        ({ user_id }) => user_id === currentUser?.id,
      );

      if (!isWorkspaceMember) {
        setIsValid(false);
        return;
      }

      const isTeamMember = teamMembers?.some(
        ({ userId }) => userId === currentUser?.id,
      );

      if (!isTeamMember) {
        await inviteUserToTeam({
          email: currentUser?.email || '',
          teamId: healthCheck?.team_id ?? '',
          workspaceId: healthCheck?.team?.workspace_id ?? '',
        });
      }

      router.push(`/health-checks/${healthCheckId}`);
    };

    run();
  }, [teamMembers, workspaceMembers]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {isValid ? (
          <>
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
            <p className="text-lg">Loading invitation...</p>
          </>
        ) : (
          'Access Denied'
        )}
      </div>
    </div>
  );
};

export default TeamInvitePage;
