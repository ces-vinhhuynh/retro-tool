'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarCharacters } from '@/utils/user';

import { WorkspaceUserTable } from '../../types/tables';

import { ActionsCell } from './actions-cell';
import { RoleCell } from './role-cell';

export const useColumns = (
  isOwnerOrAdmin: boolean,
): ColumnDef<WorkspaceUserTable>[] => {
  const columns: ColumnDef<WorkspaceUserTable>[] = [
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
      cell: ({ row }) => <RoleCell row={row} isOwnerOrAdmin={isOwnerOrAdmin} />,
    },
    {
      accessorKey: 'teams',
      header: 'Teams',
      cell: ({ row }) => {
        const { id, teams } = row.original;

        return (
          <div className="flex gap-2">
            {teams?.map((team, idx) => (
              <div
                key={`${id}_${team}_${idx}`}
                className="bg-rhino-100/60 text-rhino-600 flex items-center rounded-full px-3 py-2 font-semibold"
              >
                {team}
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  if (isOwnerOrAdmin)
    columns.push({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => <ActionsCell row={row} />,
    });

  return columns;
};
