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

import { WORKSPACE_ROLES, WorkspaceRole } from '../constants/user';

interface UserCardProps {
  user: {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: WorkspaceRole | null;
    teams: string[];
  };
  onDelete: (userId: string) => void;
  onUpdateRole: (role: WorkspaceRole) => void;
}

const UserCard = ({ user, onDelete, onUpdateRole }: UserCardProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback>
                {getAvatarCharacters(user.full_name || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-gray-900">
                {user.full_name || ''}
              </span>
              <span className="text-sm text-gray-600">{user.email || ''}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-12 text-sm font-medium text-gray-700">Role:</span>
          {user.role && (
            <Select defaultValue={user.role} onValueChange={onUpdateRole}>
              <SelectTrigger
                className={cn(
                  'h-8 w-fit cursor-pointer rounded-4xl border border-gray-200 bg-gray-100 px-3 py-1.5 font-medium text-gray-900 capitalize focus:ring-0 focus:ring-offset-0',
                  {
                    'bg-ces-orange-500 text-white':
                      user.role === WORKSPACE_ROLES.owner ||
                      user.role === WORKSPACE_ROLES.admin,
                  },
                )}
              >
                <SelectValue placeholder={WORKSPACE_ROLES[user.role]} />
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
          )}
        </div>

        <div className="flex items-start gap-3">
          <span className="w-12 py-2 text-sm font-medium text-gray-700">
            Teams:
          </span>
          <div className="flex flex-wrap gap-2">
            {user.teams.map((team) => (
              <div
                key={`${user.id}_${team}`}
                className="bg-ces-orange-100/60 text-ces-orange-600 flex items-center rounded-full px-3 py-2 text-sm font-semibold"
              >
                {team}
              </div>
            ))}
          </div>
        </div>
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
