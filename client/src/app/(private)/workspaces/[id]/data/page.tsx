'use client';

import { useParams } from 'next/navigation';

import Loading from '@/components/loading/loading';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import WorkspaceDataDashboard from '@/features/workspace/components/workspace-data-dashboard';
import { WORKSPACE_ROLES } from '@/features/workspace/constants/user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';

const WorkspaceDataPage = () => {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useCurrentUser();

  const { data: workspaceUser, isLoading: isWorkspaceUserLoading } =
    useGetWorkspaceUser(workspaceId, currentUser?.id || '');

  const isOwnerOrAdmin =
    workspaceUser?.role === WORKSPACE_ROLES.owner ||
    workspaceUser?.role === WORKSPACE_ROLES.admin;

  if (isWorkspaceUserLoading || isCurrentUserLoading) {
    return <Loading />;
  }

  if (!isOwnerOrAdmin) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to view this workspace data. Only
            workspace owners and admins can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-3 sm:px-4 md:px-8 md:py-8 lg:px-10">
      <WorkspaceDataDashboard workspaceId={workspaceId} />
    </div>
  );
};

export default WorkspaceDataPage;
