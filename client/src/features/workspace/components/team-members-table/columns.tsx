'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarCharacters } from '@/utils/user';

import { TeamMemberTable } from '../../types/tables';

import { ActionsCell } from './actions-cell';
import { RoleCell } from './role-cell';

export const useColumns = (isAdmin: boolean): ColumnDef<TeamMemberTable>[] => {
  const columns: ColumnDef<TeamMemberTable>[] = [
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
                <AvatarFallback>
                  {getAvatarCharacters(full_name)}
                </AvatarFallback>
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
      cell: ({ row }) => <RoleCell row={row} isAdmin={isAdmin} />,
    },
  ];

  if (isAdmin)
    columns.push({
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => <ActionsCell row={row} />,
    });

  return columns;
};
