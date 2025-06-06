'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarCharacters } from '@/utils/user';

import { TeamTable } from '../../types/tables';

import { ActionsCell } from './actions-cell';
import { RoleCell } from './role-cell';

export const MAX_MEMBERS_AMOUNT = 3;

export const useColumns = (isOwnerOrAdmin: boolean): ColumnDef<TeamTable>[] => {
  const columns: ColumnDef<TeamTable>[] = [
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
                <AvatarFallback>
                  {getAvatarCharacters(full_name)}
                </AvatarFallback>
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
      cell: ({ row }) => <RoleCell row={row} />,
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <ActionsCell row={row} isOwnerOrAdmin={isOwnerOrAdmin} />
      ),
    },
  ];

  return columns;
};
