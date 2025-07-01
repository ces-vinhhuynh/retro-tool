'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreVertical, Send } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getAvatarCharacters } from '@/utils/user';

import { useUpdateFacilitators } from '../../hooks/use-update-facilitators';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TeamMember = {
  id: string;
  role: string;
  full_name: string;
  avatar_url: string;
  email: string;
  userId: string;
};

export const useColumns = (
  facilitatorIds: string[],
  invitedIds: string[],
  participantIds: string[],
  inviteIds: string[],
  handleAddUser: (id: string) => void,
  handleRemoveUser: (id: string) => void,
  handleInviteUser: (ids: string[]) => void,
  healthCheckId: string,
): ColumnDef<TeamMember>[] => {
  const handleToggleUser = (id: string, value: boolean) => {
    if (value) handleAddUser(id);
    else handleRemoveUser(id);
  };
  const { mutate: updateFacilitators } = useUpdateFacilitators();

  const columns: ColumnDef<TeamMember>[] = [
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
      cell: ({ row }) => {
        const { userId } = row.original;
        const role = facilitatorIds.includes(userId)
          ? 'facilitator'
          : 'participant';

        const handleUpdateUserRole = (newRole: string) => {
          const newFacilitatorIds = [...facilitatorIds];
          if (newRole === 'facilitator') newFacilitatorIds.push(userId);
          else {
            const index = newFacilitatorIds.indexOf(userId);
            if (index !== -1) {
              newFacilitatorIds.splice(index, 1);
            }
          }

          updateFacilitators({
            id: healthCheckId,
            facilitatorIds: newFacilitatorIds,
          });
        };

        return (
          <Select value={role} onValueChange={handleUpdateUserRole}>
            <SelectTrigger className="bg-primary w-fit cursor-pointer rounded-4xl border border-gray-200 px-3 py-1.5 font-medium text-white capitalize focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder={'participant'} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(['facilitator', 'participant']).map((role) => (
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
        const { userId } = row.original;
        const isInvited = invitedIds.includes(userId);
        const isJoined = participantIds.includes(userId);

        return (
          <div className="flex items-center gap-2">
            {!isInvited && !isJoined && (
              <Switch
                checked={inviteIds.includes(userId)}
                onCheckedChange={(value) => handleToggleUser(userId, value)}
              />
            )}
            {(isInvited || isJoined) && (
              <>
                <div className="w-fit rounded-4xl border border-gray-200 bg-gray-300/50 px-3 py-1.5 font-medium text-gray-900 capitalize focus:ring-0">
                  {isJoined ? 'JOINED' : 'INVITED'}
                </div>
                {isJoined || (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="hover:text-primary flex w-full cursor-pointer justify-start gap-4 px-5"
                        onClick={() => handleInviteUser([userId])}
                      >
                        <Send className="h-4 w-4" />
                        <span>Resend</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];

  return columns;
};
