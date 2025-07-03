'use client';

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
import { cn } from '@/lib/utils';
import { getAvatarCharacters } from '@/utils/user';

import {
  TEAM_ROLES,
  TeamRole,
  WORKSPACE_ROLES,
  WorkspaceRole,
} from '../constants/user';

interface UserCardProps {
  user: {
    id: string;
    email?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    role?: WorkspaceRole | TeamRole | null;
    teams?: string[];
  };
  onDelete: (userId: string) => void;
  onUpdateRole: (role: WorkspaceRole | TeamRole) => void;
  isWorkspaceUserCard?: boolean;
  isOwnerOrAdmin: boolean;
  currentUserRole: WorkspaceRole;
}

export const UserCard = ({
  user,
  onDelete,
  onUpdateRole,
  isWorkspaceUserCard = true,
  isOwnerOrAdmin,
  currentUserRole,
}: UserCardProps) => {
  const roles = isWorkspaceUserCard
    ? Object.values([WORKSPACE_ROLES.admin, WORKSPACE_ROLES.member])
    : Object.values(TEAM_ROLES);

  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-xl border border-gray-200 p-8 shadow">
      <div className="flex flex-col items-center gap-3">
        <Avatar className="h-15 w-15">
          <AvatarImage src={user.avatar_url || ''} />
          <AvatarFallback>
            {getAvatarCharacters(user.full_name || '')}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1">
          <p className="truncate text-base font-semibold text-gray-900">
            {user.full_name || ''}
          </p>
          <p className="truncate text-sm text-gray-600">{user.email || ''}</p>
        </div>
      </div>
      {(currentUserRole === WORKSPACE_ROLES.owner || !isOwnerOrAdmin) && (
        <div
          className={cn(
            'bg-primary flex h-8 w-fit min-w-24 cursor-pointer items-center justify-center rounded-4xl border border-gray-200 px-3 py-1.5 font-medium text-white capitalize focus:ring-0 focus:ring-offset-0',
            {
              'bg-gray-100 text-gray-900': isWorkspaceUserCard
                ? user.role === WORKSPACE_ROLES.member
                : user.role === TEAM_ROLES.member,
            },
          )}
        >
          {WORKSPACE_ROLES[user.role || 'member']}
        </div>
      )}
      {currentUserRole !== WORKSPACE_ROLES.owner &&
        isOwnerOrAdmin &&
        user.role && (
          <Select value={user.role} onValueChange={onUpdateRole}>
            <SelectTrigger
              className={cn(
                'bg-primary h-8 w-fit min-w-24 cursor-pointer rounded-4xl border border-gray-200 px-3 py-1.5 font-medium text-white capitalize focus:ring-0 focus:ring-offset-0',
                {
                  'bg-gray-100 text-gray-900': isWorkspaceUserCard
                    ? user.role === WORKSPACE_ROLES.member
                    : user.role === TEAM_ROLES.member,
                },
              )}
            >
              <SelectValue placeholder={WORKSPACE_ROLES[user.role]} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(roles).map((role) => (
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
        )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-gray-700">Teams</p>
        <div className="flex flex-wrap gap-2">
          {user.teams?.map((team, idx) => (
            <div
              key={`${user.id}_${team}_${idx}`}
              className="text-primary-text flex max-w-full items-center truncate rounded-sm bg-gray-100 px-3 py-2 text-sm font-semibold"
            >
              {team}
            </div>
          ))}
        </div>
      </div>

      {isOwnerOrAdmin && (
        <Button
          variant="ghost"
          onClick={() => onDelete(user.id)}
          className="hover:text-primary p-0 hover:bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
          <span>Remove</span>
        </Button>
      )}
    </div>
  );
};
