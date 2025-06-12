'use client';

import { Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import {
  TEAM_ROLES,
  WORKSPACE_ROLES,
} from '@/features/workspace/constants/user';
import { useGetTeamsByWorkspace } from '@/features/workspace/hooks/use-get-teams-by-workspace';
import { useGetTeamsByWorkspaceAndUser } from '@/features/workspace/hooks/use-get-teams-by-workspace-and-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';
import { cn } from '@/lib/utils';
import { getAvatarCharacters } from '@/utils/user';

const WorkspacePage = () => {
  const { id: workspaceId } = useParams<{ id: string }>();

  const { data: currentUser } = useCurrentUser();
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
    <div className="flex flex-col gap-3 p-3 sm:px-4 md:px-8 md:py-8 lg:px-10">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Welcome back,</h1>
          <p className="text-sm text-gray-500">
            Track your team health and recent retrospectives
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 py-5">
        <h2 className="text-lg font-semibold">Your teams</h2>
        {teams?.length === 0 ? (
          <p className="text-sm text-gray-500">
            You are not a member of any team in this workspace
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {teams?.map((team) => {
              const currentUserRole = team.users.find(
                (user) => user.id === currentUser?.id,
              )?.role;

              return (
                <Link key={team.id} href={`/teams/${team.id}`}>
                  <div className="relative flex h-48 cursor-pointer flex-col items-center justify-between gap-4 rounded-lg border bg-white p-6 text-gray-900 shadow-sm transition-all duration-75 ease-in-out hover:scale-105">
                    <Avatar className="size-12 rounded-none text-2xl font-medium text-white sm:size-14">
                      {team.logo_url ? (
                        <AvatarImage src={team.logo_url} alt={team.name} />
                      ) : (
                        <AvatarFallback className="bg-ces-orange-500 rounded-sm">
                          {getAvatarCharacters(team.name || 'U')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="text-center text-base font-medium">
                      {team.name}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      {currentUserRole && (
                        <span
                          className={cn(
                            'bg-ces-orange-500 rounded-full border border-white/30 px-2.5 py-1 text-sm font-semibold tracking-wider text-white capitalize',
                            currentUserRole === TEAM_ROLES.member &&
                              'bg-gray-300/50 text-gray-800',
                          )}
                        >
                          {currentUserRole}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-center text-sm font-medium">
                        <Users className="h-4 w-4" />
                        {team.users.length || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
