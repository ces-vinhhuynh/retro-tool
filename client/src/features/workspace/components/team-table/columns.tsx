'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { cn } from '@/utils/cn';
import { getAvatarCharacters } from '@/utils/user';

import { TEAM_ROLES } from '../../constants/user';
import { useDeleteTeam } from '../../hooks/use-delete-team';
import EditTeamDialog from '../edit-team-dialog';

export type Team = {
  id: string;
  name: string;
  users: {
    id: string;
    full_name: string;
    avatar_url: string;
    role: (typeof TEAM_ROLES)[keyof typeof TEAM_ROLES];
  }[];
};

export const MAX_MEMBERS_AMOUNT = 3;

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: 'name',
    header: 'Team',
    cell: ({ row }) => {
      const { id, name } = row.original;

      return <Link href={`/teams/${id}`}>{name}</Link>;
    },
  },
  {
    accessorKey: 'members',
    header: 'Members',
    cell: ({ row }) => {
      const { users } = row.original;
      const limitedMembers = users.slice(0, MAX_MEMBERS_AMOUNT);

      return (
        <div className="flex flex-row -space-x-2">
          {limitedMembers.map(({ avatar_url, full_name }, index) => (
            <Avatar key={index} className="border border-white">
              <AvatarImage src={avatar_url} />
              <AvatarFallback>{getAvatarCharacters(full_name)}</AvatarFallback>
            </Avatar>
          ))}
          {users.length > MAX_MEMBERS_AMOUNT && (
            <Avatar className="border border-white">
              <AvatarFallback>{`+${users.length - MAX_MEMBERS_AMOUNT}`}</AvatarFallback>
            </Avatar>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Your Role',
    cell: ({ row }) => {
      const { data: currentUser } = useCurrentUser();
      const { users } = row.original;
      const currentUserRole =
        users.find(({ id }) => currentUser?.id === id)?.role ||
        TEAM_ROLES.member;

      return (
        <div
          className={cn(
            'w-fit rounded-4xl border border-gray-200 bg-gray-300/50 px-3 py-1.5 font-medium text-gray-900 capitalize focus:ring-0',
            {
              'bg-ces-orange-500 text-white':
                currentUserRole === TEAM_ROLES.admin,
            },
          )}
        >
          {TEAM_ROLES[currentUserRole as keyof typeof TEAM_ROLES]}
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id } = row.original;
      const { mutate: deleteTeam } = useDeleteTeam();
      const [dialogOpen, setDialogOpen] = useState(false);

      const handleDeleteTeam = (id: string) => {
        deleteTeam(id);
      };

      return (
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => setDialogOpen(true)}
                className="primary hover:text-ces-orange-500 w-full cursor-pointer justify-start px-5"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleDeleteTeam(id)}
                className="primary focus:text-ces-orange-500 w-full cursor-pointer justify-start px-5 text-red-600 focus:bg-transparent focus-visible:ring-0"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <EditTeamDialog
            teamId={id}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        </>
      );
    },
  },
];
