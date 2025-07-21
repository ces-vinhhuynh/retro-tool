'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  isCompact?: boolean;
}

export const UserCard = ({
  user,
  onDelete,
  onUpdateRole,
  isWorkspaceUserCard = true,
  isOwnerOrAdmin,
  currentUserRole,
  isCompact = false,
}: UserCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const roles = isWorkspaceUserCard
    ? Object.values([WORKSPACE_ROLES.admin, WORKSPACE_ROLES.member])
    : Object.values(TEAM_ROLES);

  const handleDelete = () => {
    onDelete(user.id);
    setShowDeleteDialog(false);
  };

  if (isCompact) {
    return (
      <div className="flex h-44 flex-col items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-2 shadow">
        <div className="flex flex-col items-center gap-2 text-center">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={user.avatar_url || ''} />
            <AvatarFallback className="text-xs">
              {getAvatarCharacters(user.full_name || '')}
            </AvatarFallback>
          </Avatar>
          <div className="flex w-full min-w-0 flex-col items-center gap-1">
            <span className="line-clamp-1 text-xs font-semibold text-gray-900 no-underline">
              {user.full_name || 'No name'}
            </span>
            <span className="max-h-8 overflow-hidden text-center text-xs leading-tight break-words break-all text-gray-600 no-underline">
              {user.email || ''}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {(currentUserRole === WORKSPACE_ROLES.owner || !isOwnerOrAdmin) && (
            <div
              className={cn(
                'bg-primary flex h-6 w-fit cursor-pointer items-center justify-center rounded-full border border-gray-200 px-2 py-1 text-xs font-medium text-white capitalize focus:ring-0 focus:ring-offset-0',
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
                    'bg-primary h-6 w-fit cursor-pointer rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-white capitalize focus:ring-0 focus:ring-offset-0',
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

        {isWorkspaceUserCard && user.teams && user.teams.length > 0 && (
          <div className="flex w-full flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-700">Teams</span>
            <div className="flex max-h-8 w-full flex-wrap justify-center gap-1 overflow-hidden">
              {user.teams.slice(0, 2).map((team, idx) => (
                <div
                  key={`${user.id}_${team}_${idx}`}
                  className="bg-rhino-100/60 text-rhino-600 line-clamp-1 max-w-full truncate rounded-full px-2 py-0.5 text-xs font-semibold"
                >
                  {team}
                </div>
              ))}
              {user.teams.length > 2 && (
                <div className="bg-rhino-100/60 text-rhino-600 rounded-full px-2 py-0.5 text-xs font-semibold">
                  +{user.teams.length - 2}
                </div>
              )}
            </div>
          </div>
        )}

        {isOwnerOrAdmin && (
          <>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(true)}
              className="flex h-6 items-center gap-1 px-2 py-1 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            >
              <Trash2 className="h-3 w-3" />
              <span className="text-xs">Remove</span>
            </Button>

            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Member</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove{' '}
                    <strong>{user.full_name || user.email}</strong> from this
                    team? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    );
  }

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
              <span className="text-sm leading-tight break-words break-all text-gray-600">
                {user.email || ''}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-12 text-sm font-medium text-gray-700">Role:</span>
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
                  className="bg-rhino-100/60 text-rhino-600 flex max-w-full items-center truncate rounded-full px-3 py-2 text-sm font-semibold"
                >
                  {team}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isOwnerOrAdmin && (
        <>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteDialog(true)}
            className="hover:text-primary p-0 hover:bg-transparent"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Member</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove{' '}
                  <strong>{user.full_name || user.email}</strong> from this{' '}
                  {isWorkspaceUserCard ? 'workspace' : 'team'}? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};
