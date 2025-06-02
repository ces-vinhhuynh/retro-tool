'use client';

import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

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

const WorkspaceInvitePageWithSuspense = () => {
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
      <WorkspaceInvitePage />
    </Suspense>
  );
};

export default WorkspaceInvitePageWithSuspense;
