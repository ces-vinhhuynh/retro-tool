'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import InviteHandler from '@/features/workspace/components/invite-handler';
import { useGetWorkspaceUserByToken } from '@/features/workspace/hooks/use-get-workspace-user-by-token';
import { useUpdateWorkspaceUser } from '@/features/workspace/hooks/use-update-workspace-user';
import { INVITATION_STATUS } from '@/features/workspace/utils/constant';

const WorkspaceInvitePage = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { data: workspaceUser, isLoading: isLoadingWorkspaceUser } =
    useGetWorkspaceUserByToken(token ?? '');
  const { mutate: updateWorkspaceUser, isPending: isUpdatingWorkspaceUser } =
    useUpdateWorkspaceUser();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link. No token provided.');
      return;
    }

    if (
      workspaceUser?.token_expires_at &&
      new Date(workspaceUser.token_expires_at) < new Date()
    ) {
      setError('Invitation link has expired.');
      return;
    }

    if (currentUser && workspaceUser) {
      updateWorkspaceUser({
        id: workspaceUser.id,
        workspaceUser: {
          status: INVITATION_STATUS.ACCEPTED,
          user_id: currentUser.id,
          updated_at: new Date().toISOString(),
        },
      });
      router.push(`/workspaces/${workspaceUser.workspace_id}`);
    }
  }, [token, workspaceUser, currentUser, updateWorkspaceUser, router]);

  const isLoading = isLoadingWorkspaceUser || isUpdatingWorkspaceUser;

  return <InviteHandler isLoading={isLoading} error={error} />;
};

export default WorkspaceInvitePage;
