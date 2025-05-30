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
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: WorkspaceRole | TeamRole | null;
    teams?: string[];
  };
  onDelete: (userId: string) => void;
  onUpdateRole: (role: WorkspaceRole | TeamRole) => void;
  isWorkspaceUserCard?: boolean;
}

const UserCard = ({
  user,
  onDelete,
  onUpdateRole,
  isWorkspaceUserCard = true,
}: UserCardProps) => {
  const roles = isWorkspaceUserCard
    ? Object.values(WORKSPACE_ROLES)
    : Object.values(TEAM_ROLES);

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow">
      <div className="flex w-full flex-col gap-5 sm:w-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 sm:items-center">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback>
                {getAvatarCharacters(user.full_name || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-base font-semibold text-gray-900">
                {user.full_name || ''}
              </span>
              <span className="truncate text-sm text-gray-600">
                {user.email || ''}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-12 text-sm font-medium text-gray-700">Role:</span>
          {user.role && (
            <Select value={user.role} onValueChange={onUpdateRole}>
              <SelectTrigger
                className={cn(
                  'bg-ces-orange-500 h-8 w-fit min-w-24 cursor-pointer rounded-4xl border border-gray-200 px-3 py-1.5 font-medium text-white capitalize focus:ring-0 focus:ring-offset-0',
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
        </div>

        {isWorkspaceUserCard && (
          <div className="flex flex-wrap items-start gap-3">
            <span className="w-12 py-2 text-sm font-medium text-gray-700">
              Teams:
            </span>
            <div className="flex min-w-0 flex-wrap gap-2">
              {user.teams?.map((team, idx) => (
                <div
                  key={`${user.id}_${team}_${idx}`}
                  className="bg-ces-orange-100/60 text-ces-orange-600 flex max-w-full items-center truncate rounded-full px-3 py-2 text-sm font-semibold"
                >
                  {team}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        onClick={() => onDelete(user.id)}
        className="hover:text-ces-orange-500 p-0 hover:bg-transparent"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserCard;
