'use client';

import { useParams } from 'next/navigation';

import { Layout } from '@/components/layout/layout';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import CreateTeamDialog from '@/features/workspace/components/create-team-dialog';
import TeamCard from '@/features/workspace/components/team-card';
import { columns } from '@/features/workspace/components/team-table/columns';
import { DataTable } from '@/features/workspace/components/user-table/data-table';
import { TEAM_ROLES } from '@/features/workspace/constants/user';
import { useDeleteTeam } from '@/features/workspace/hooks/use-delete-team';
import { useGetWorkspaceTeams } from '@/features/workspace/hooks/use-get-workspace-teams';

export default function WorkspacePage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { data: teams = [] } = useGetWorkspaceTeams(workspaceId);
  const { data: currentUser } = useCurrentUser();
  const { mutate: deleteTeam } = useDeleteTeam();

  return (
    <Layout>
      <div className="flex flex-col gap-3 p-3 sm:px-4 md:px-8 md:py-8 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold md:text-2xl">Teams Management</h1>
          <div className="mb-1 sm:mb-0">
            <CreateTeamDialog workspaceId={workspaceId} />
          </div>
        </div>
        <div className="flex flex-col gap-6 rounded-xl bg-white p-3 shadow-sm sm:p-5">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold md:text-xl">All Teams</h2>
            <p className="text-sm text-gray-600">
              Manage teams and track their health
            </p>
          </div>
          {/* Mobile */}
          <div className="flex flex-col gap-3 sm:hidden">
            {teams.map((team) => {
              const currentUserRole =
                team.users.find(({ id }) => currentUser?.id === id)?.role ||
                TEAM_ROLES.member;
              return (
                <TeamCard
                  key={team.id}
                  team={team}
                  currentUserRole={currentUserRole}
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
    </Layout>
  );
}
