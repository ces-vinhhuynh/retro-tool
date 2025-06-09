'use client';

import { useParams } from 'next/navigation';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import CreateTeamDialog from '@/features/workspace/components/create-team-dialog';
import { DataTable } from '@/features/workspace/components/data-table';
import TeamCard from '@/features/workspace/components/team-card';
import { useColumns } from '@/features/workspace/components/team-table/columns';
import { WORKSPACE_ROLES } from '@/features/workspace/constants/user';
import { useDeleteTeam } from '@/features/workspace/hooks/use-delete-team';
import { useGetTeamsByWorkspace } from '@/features/workspace/hooks/use-get-teams-by-workspace';
import { useGetWorkspaceTeams } from '@/features/workspace/hooks/use-get-workspace-teams';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';

export default function WorkspacePage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { data: currentUser } = useCurrentUser();
  const { data: teamsByMember = [] } = useGetWorkspaceTeams(
    workspaceId,
    currentUser?.id || '',
  );
  const { data: teamsByAdmin = [] } = useGetTeamsByWorkspace(workspaceId);

  const { mutate: deleteTeam } = useDeleteTeam();
  const { data: workspaceUser } = useGetWorkspaceUser(
    workspaceId,
    currentUser?.id || '',
  );

  const isOwnerOrAdmin =
    workspaceUser?.role === WORKSPACE_ROLES.owner ||
    workspaceUser?.role === WORKSPACE_ROLES.admin;

  const teams = isOwnerOrAdmin ? teamsByAdmin : teamsByMember;

  const columns = useColumns(isOwnerOrAdmin);

  return (
    <div className="flex flex-col gap-3 p-3 sm:px-4 md:px-8 md:py-8 lg:px-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold md:text-2xl">Teams Management</h1>
        <div className="mb-1 sm:mb-0">
          {isOwnerOrAdmin && <CreateTeamDialog workspaceId={workspaceId} />}
        </div>
      </div>
      <div className="flex flex-col gap-6 rounded-xl bg-white p-3 shadow-sm sm:p-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold md:text-xl">All Teams</h2>
          <p className="text-sm text-gray-600">
            Manage teams and track their health
          </p>
        </div>
        {/* Mobile */}
        <div className="flex flex-col gap-3 sm:hidden">
          {teams.map((team) => {
            const currentUserRole = team.users.find(
              ({ id }) => currentUser?.id === id,
            )?.role;
            return (
              <TeamCard
                key={team.id}
                team={team}
                currentUserRole={currentUserRole}
                isOwnerOrAdmin={isOwnerOrAdmin}
                onDelete={deleteTeam}
              />
            );
          })}
        </div>
        {/* Desktop */}
        <div className="hidden w-full overflow-x-auto sm:block">
          <DataTable columns={columns} data={teams} />
        </div>
      </div>
    </div>
  );
}
