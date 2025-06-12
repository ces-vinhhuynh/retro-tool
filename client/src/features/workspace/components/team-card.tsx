'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import EditTeamDialog from '@/features/workspace/components/edit-team-dialog';
import { MAX_MEMBERS_AMOUNT } from '@/features/workspace/components/team-table/columns';
import { TEAM_ROLES, TeamRole } from '@/features/workspace/constants/user';
import { cn } from '@/lib/utils';
import { getAvatarCharacters } from '@/utils/user';

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    logo_url: string | null;
    users: Array<{
      id: string;
      avatar_url: string | null;
      full_name: string | null;
      role: TeamRole | null;
    }>;
  };
  currentUserRole?: TeamRole;
  isOwnerOrAdmin: boolean;
  onDelete: (teamId: string) => void;
}

const TeamCard = ({
  team,
  currentUserRole,
  isOwnerOrAdmin,
  onDelete,
}: TeamCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const limitedMembers = team.users.slice(0, MAX_MEMBERS_AMOUNT);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow">
      <div className="flex items-center justify-between">
        <Link href={`/teams/${team.id}`}>
          <span className="text-base font-semibold text-gray-900">
            {team.name}
          </span>
        </Link>
        <div
          className={cn('flex items-center gap-4', {
            hidden: !isOwnerOrAdmin && currentUserRole === TEAM_ROLES.member,
          })}
        >
          <EditTeamDialog
            teamId={team.id}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          >
            <Button
              variant="ghost"
              onSelect={() => setDialogOpen(true)}
              className="primary hover:text-ces-orange-500 flex w-full cursor-pointer justify-start gap-4 px-5"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </EditTeamDialog>
          <Button
            variant="ghost"
            onClick={() => onDelete(team.id)}
            className="hover:text-ces-orange-500 p-0 hover:bg-transparent"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Members:</span>
        <div className="flex flex-row -space-x-2">
          <div className="flex flex-row -space-x-2">
            {limitedMembers.map(({ avatar_url, full_name }, index) => (
              <Avatar key={index} className="border border-white">
                <AvatarImage src={avatar_url || ''} />
                <AvatarFallback>
                  {getAvatarCharacters(full_name || '')}
                </AvatarFallback>
              </Avatar>
            ))}
            {team.users.length > MAX_MEMBERS_AMOUNT && (
              <Avatar className="border border-white">
                <AvatarFallback>{`+${team.users.length - MAX_MEMBERS_AMOUNT}`}</AvatarFallback>
              </Avatar>
            )}
          </div>
          {team.users.length > 3 && (
            <Avatar className="h-6 w-6 border border-white">
              <AvatarFallback>{`+${team.users.length - 3}`}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Your Role:</span>
        {currentUserRole && (
          <span
            className={cn(
              'inline-block w-fit rounded-full border border-gray-200 bg-gray-300/50 px-2.5 py-1 text-xs font-medium capitalize',
              {
                'bg-ces-orange-500 text-white':
                  currentUserRole === TEAM_ROLES.admin,
              },
            )}
          >
            {TEAM_ROLES[currentUserRole]}
          </span>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
