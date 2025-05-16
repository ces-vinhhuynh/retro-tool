'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { getAvatarCharacters } from '@/utils/user';

import { WORKSPACE_ROLES } from '../../constants/user';

export type WorkspaceUser = {
  id: string;
  avatar_url: string;
  full_name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  projects: string[];
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
      const { role } = row.original;

      return (
        <div
          className={cn(
            'w-fit rounded-4xl border border-gray-200 px-3 py-1.5',
            {
              'bg-ces-orange-500 text-white':
                role === 'owner' || role === 'admin',
            },
          )}
        >
          {WORKSPACE_ROLES[role]}
        </div>
      );
    },
  },
  {
    accessorKey: 'projects',
    header: 'Projects',
    cell: ({ row }) => {
      const { id, projects } = row.original;

      return (
        <div className="flex gap-2">
          {projects.map((project) => (
            <div
              key={`${id}_${project}`}
              className="flex items-center rounded-sm bg-gray-100 p-1.5"
            >
              {project}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => {
      // TODO: update remove function
      return (
        <Button variant="ghost">
          <Trash2 className="text-ces-orange-500 h-4 w-4" />
        </Button>
      );
    },
  },
];
