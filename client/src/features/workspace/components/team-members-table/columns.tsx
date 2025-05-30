'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils/cn';
import { getAvatarCharacters } from '@/utils/user';

import { TEAM_ROLES, TeamRole } from '../../constants/user';
import { useDeleteTeamMember } from '../../hooks/use-delete-team-member';
import { useUpdateTeamUser } from '../../hooks/use-update-team-user';

export type TeamMember = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  role: TeamRole;
};

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: 'full_name',
    header: 'Name',
    cell: ({ row }) => {
      const { avatar_url, full_name } = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 cursor-pointer">
            {avatar_url ? (
              <AvatarImage src={avatar_url} alt={full_name ?? 'User'} />
            ) : (
              <AvatarFallback>{getAvatarCharacters(full_name)}</AvatarFallback>
            )}
          </Avatar>
          {full_name}
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const { id, role } = row.original;
      const { mutate: updateTeamUser } = useUpdateTeamUser();

      const handleUpdateTeamUser = (newRole: TeamRole) => {
        updateTeamUser({ id, teamUser: { role: newRole } });
      };

      return (
        <Select value={role} onValueChange={handleUpdateTeamUser}>
          <SelectTrigger
            className={cn(
              'w-fit cursor-pointer rounded-4xl border border-gray-200 bg-gray-100 px-3 py-1.5 font-medium text-gray-900 capitalize focus:ring-0 focus:ring-offset-0',
              {
                'bg-ces-orange-500 text-white': role === TEAM_ROLES.admin,
              },
            )}
          >
            <SelectValue placeholder={TEAM_ROLES[role]} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TEAM_ROLES).map((role) => (
              <SelectItem
                key={role}
                value={role}
                className="text-gray-900 capitalize"
              >
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id } = row.original;
      const { mutate: deleteTeamMember } = useDeleteTeamMember();

      const handleDeleteTeamMember = (id: string) => {
        deleteTeamMember(id);
      };

      return (
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => handleDeleteTeamMember(id)}>
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
