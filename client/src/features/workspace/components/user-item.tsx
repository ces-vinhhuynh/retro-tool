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
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 p-2 shadow md:gap-5 md:p-8">
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        <Avatar className="h-12 w-12 sm:h-15 sm:w-15">
          <AvatarImage src={user.avatar_url || ''} />
          <AvatarFallback>
            {getAvatarCharacters(user.full_name || '')}
          </AvatarFallback>
        </Avatar>
        <div className="flex w-full max-w-full flex-col items-center gap-1 px-1">
          <p className="w-full max-w-full text-center text-sm font-semibold break-words text-gray-900 sm:text-base">
            {user.full_name || ''}
          </p>
          <p className="w-full max-w-full overflow-hidden text-center text-xs leading-tight break-all text-gray-600 sm:text-sm">
            {user.email || ''}
          </p>
        </div>
      </div>
      {(currentUserRole === WORKSPACE_ROLES.owner || !isOwnerOrAdmin) && (
        <div
          className={cn(
            'bg-primary flex h-7 w-fit min-w-20 cursor-pointer items-center justify-center rounded-4xl border border-gray-200 px-2 py-1 text-xs font-medium text-white capitalize focus:ring-0 focus:ring-offset-0 sm:h-8 sm:min-w-24 sm:px-3 sm:py-1.5 sm:text-sm',
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
                'bg-primary h-7 w-fit min-w-20 cursor-pointer rounded-4xl border border-gray-200 px-2 py-1 text-xs font-medium text-white capitalize focus:ring-0 focus:ring-offset-0 sm:h-8 sm:min-w-24 sm:px-3 sm:py-1.5 sm:text-sm',
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

      {/* Teams Section - Fixed layout for mobile and long team names */}
      {user.teams && user.teams.length > 0 && (
        <div className="flex w-full flex-col items-center gap-1 sm:gap-2">
          <p className="text-xs font-medium text-gray-700 sm:text-sm">Teams</p>
          <div className="flex w-full flex-wrap justify-center gap-1 sm:gap-2">
            {user.teams?.map((team, idx) => (
              <div
                key={`${user.id}_${team}_${idx}`}
                className="text-primary-text inline-flex min-w-0 max-w-full flex-shrink-0 items-center break-words rounded-sm bg-gray-100 px-2 py-1 text-xs font-medium leading-relaxed sm:px-3 sm:py-2 sm:text-sm sm:font-semibold"
                style={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  maxWidth: 'calc(100% - 0.25rem)', // Account for gap
                }}
              >
                <span className="text-center">{team}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOwnerOrAdmin && (
        <Button
          variant="ghost"
          onClick={() => onDelete(user.id)}
          className="flex h-7 items-center gap-1 p-0 text-xs hover:bg-transparent hover:text-red-500 sm:h-auto sm:text-sm"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Remove</span>
        </Button>
      )}
    </div>
  );
};