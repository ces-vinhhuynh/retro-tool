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

import { WORKSPACE_ROLES } from '../../constants/user';
import { useDeleteWorkspaceUser } from '../../hooks/use-delete-workspace-user';
import { useUpdateWorkspaceUser } from '../../hooks/use-update-workspace-user';

export type WorkspaceUser = {
  id: string;
  avatar_url: string;
  full_name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  teams: string[];
};

export const columns: ColumnDef<WorkspaceUser>[] = [
  {
    accessorKey: 'user',
    header: 'User',
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
      const { mutate: updateWorkspaceUser } = useUpdateWorkspaceUser();

      const handleUpdateWorkspaceUser = (
        newRole: 'owner' | 'admin' | 'member',
      ) => {
        updateWorkspaceUser({ id, workspaceUser: { role: newRole } });
      };

      return (
        <Select defaultValue={role} onValueChange={handleUpdateWorkspaceUser}>
          <SelectTrigger
            className={cn(
              'w-fit cursor-pointer rounded-4xl border border-gray-200 bg-gray-100 px-3 py-1.5 font-medium text-gray-900 capitalize focus:ring-0 focus:ring-offset-0',
              {
                'bg-ces-orange-500 text-white':
                  role === 'owner' || role === 'admin',
              },
            )}
          >
            <SelectValue placeholder={WORKSPACE_ROLES[role]} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(WORKSPACE_ROLES).map((role) => (
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
    accessorKey: 'teams',
    header: 'Teams',
    cell: ({ row }) => {
      const { id, teams } = row.original;

      return (
        <div className="flex gap-2">
          {teams.map((team) => (
            <div
              key={`${id}_${team}`}
              className="bg-ces-orange-100/60 text-ces-orange-600 flex items-center rounded-full px-3 py-2 font-semibold"
            >
              {team}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id } = row.original;
      const { mutate: deleteWorkspaceUser } = useDeleteWorkspaceUser();

      const handleDeleteWorkspaceUser = (id: string) => {
        deleteWorkspaceUser(id);
      };

      return (
        <Button
          variant="ghost"
          onClick={() => handleDeleteWorkspaceUser(id)}
          className="hover:text-ces-orange-500 p-0 hover:bg-transparent"
        >
          <Trash2 />
        </Button>
      );
    },
  },
];
