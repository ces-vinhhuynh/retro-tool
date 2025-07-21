'use client';

import { useParams } from 'next/navigation';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { CreateTeamDialog } from '@/features/workspace/components/create-team-dialog';
import { TeamItem } from '@/features/workspace/components/team-item';
import { WORKSPACE_ROLES } from '@/features/workspace/constants/user';
import { useGetTeamsByWorkspace } from '@/features/workspace/hooks/use-get-teams-by-workspace';
import { useGetTeamsByWorkspaceAndUser } from '@/features/workspace/hooks/use-get-teams-by-workspace-and-user';
import { useGetWorkspace } from '@/features/workspace/hooks/use-get-workspace';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';

const WorkspacePage = () => {
  const { id: workspaceId } = useParams<{ id: string }>();

  const { data: currentUser } = useCurrentUser();
  const { data: workspace } = useGetWorkspace(workspaceId);
  const { data: allTeamsInWorkspace, isLoading } = useGetTeamsByWorkspace(
    workspaceId,
    {
      enabled: !!workspaceId,
    },
  );
  const { data: teamsOfUser } = useGetTeamsByWorkspaceAndUser(
    workspaceId,
    currentUser?.id || '',
  );
  const { data: workspaceUser } = useGetWorkspaceUser(
    workspaceId,
    currentUser?.id || '',
  );

  const isOwnerOrAdmin =
    workspaceUser?.role === WORKSPACE_ROLES.owner ||
    workspaceUser?.role === WORKSPACE_ROLES.admin;

  const teams = isOwnerOrAdmin ? allTeamsInWorkspace : teamsOfUser;

  if (isLoading) return <></>;

  return (
    <div className="flex flex-col gap-10 p-3 sm:px-4 md:px-8 md:py-8 lg:px-10">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Welcome to {workspace?.name}</h1>
          <p className="text-sm text-gray-500">
            Manage your team&apos;s projects and track progress
          </p>
        </div>
        {isOwnerOrAdmin && <CreateTeamDialog workspaceId={workspaceId} />}
      </div>
      <div className="flex justify-center">
        {!teams?.length ? (
          <p className="text-sm text-gray-500">
            You are not a member of any team in this workspace
          </p>
        ) : (
          <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams?.map((team) => (
              <TeamItem
                key={team.id}
                team={team}
                isOwnerOrAdmin={isOwnerOrAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
