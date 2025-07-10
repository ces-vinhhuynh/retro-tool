'use client';

import { Heart, MoreHorizontal, Pencil, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import ConfirmModal from '@/components/modal/confirm-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useGetHealthChecksByTeam } from '@/features/health-check/hooks/use-get-healt-checks-by-team';
import { useTemplates } from '@/features/health-check/hooks/use-health-check-templates';
import { HealthCheck } from '@/features/health-check/types/health-check';
import { cn } from '@/utils/cn';

import { TEAM_ROLES } from '../constants/user';
import { useDeleteTeam } from '../hooks/use-delete-team';
import { calculateTeamAverage } from '../utils/workspace-metrics';

import EditTeamDialog from './edit-team-dialog';

interface TeamItemProps {
  team: {
    id: string;
    name: string;
    logo_url: string | null;
    users: {
      id: string;
      full_name: string;
      avatar_url: string;
      role: 'admin' | 'member' | null;
    }[];
  };
  isOwnerOrAdmin: boolean;
}

export const TeamItem = ({ team, isOwnerOrAdmin }: TeamItemProps) => {
  const { data: currentUser } = useCurrentUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
  const { data: healthChecks } = useGetHealthChecksByTeam(team.id);
  const { data: templates = [] } = useTemplates();

  const teamScore = calculateTeamAverage(
    healthChecks as HealthCheck[],
    templates,
  );

  const { mutate: deleteTeam } = useDeleteTeam();

  const currentUserRole = team.users.find(
    (user) => user.id === currentUser?.id,
  )?.role;

  const handleDeleteTeam = (id: string) => {
    deleteTeam(id);
  };

  function simpleTimeAgo(dateStr: string): string {
    const now = new Date();
    const then = new Date(dateStr);

    // Strip time from both for full-day accuracy
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thenDate = new Date(
      then.getFullYear(),
      then.getMonth(),
      then.getDate(),
    );

    const diffMs = nowDate.getTime() - thenDate.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (isNaN(days)) return 'not yet';
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return 'last year';
  }
  console.log('team.users', team.users);
  return (
    <>
      <Card
        key={team.id}
        className="relative flex h-72 flex-col gap-4 rounded-lg border p-6 text-gray-900 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <p className="text-2xl font-medium">{team.name}</p>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                disabled={
                  !isOwnerOrAdmin && currentUserRole !== TEAM_ROLES.admin
                }
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => setDialogOpen(true)}
                className="hover:text-primary flex w-full cursor-pointer justify-start gap-4 px-5"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setIsOpenModalConfirm(true)}
                className="focus:text-primary flex w-full cursor-pointer justify-start gap-4 px-5 text-red-600 focus:bg-transparent focus-visible:ring-0"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="hover:text-primary-text text-primary-text flex items-center gap-1 p-0 text-center text-sm font-medium hover:bg-transparent"
              >
                <Users className="h-4 w-4" />
                {team.users.length || 0} members
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
              <div className="flex flex-col gap-5">
                <h4 className="leading-none font-medium">Team Members</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {team.users.map((user, index) => (
                    <li
                      key={`user.id-${index}`}
                      className="flex items-center gap-2"
                    >
                      <Avatar>
                        <AvatarImage
                          src={user.avatar_url ?? ''}
                          alt={user.full_name ?? 'User'}
                          className="h-8 w-8 bg-gray-300"
                        />
                        <AvatarFallback className="bg-rhino-300 text-rhino-800 font-bold">
                          {user.full_name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.full_name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </PopoverContent>
          </Popover>
          <span className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>
              {!!healthChecks?.length &&
                ((teamScore <= 0.3 && 'At Risk') ||
                  (teamScore > 0.3 && teamScore <= 0.7 && 'Needs Attention') ||
                  (teamScore > 0.7 && 'Good'))}
            </span>
          </span>
        </div>
        <div className="text-secondary-text mt-auto flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span>Project Health</span>
            <span>
              Last check: {simpleTimeAgo(healthChecks?.[0]?.created_at || '')}
            </span>
          </div>
          <Progress
            value={teamScore * 100}
            className={cn('h-1.5 bg-gray-100 [&>div]:bg-green-500', {
              '[&>div]:bg-yellow-500': teamScore > 0.3 && teamScore <= 0.7,
              '[&>div]:bg-red-500': teamScore <= 0.3,
            })}
          />
        </div>
        <Link
          href={`/teams/${team.id}`}
          className="text-link-text text-center hover:underline"
        >
          View Team
        </Link>
      </Card>
      <EditTeamDialog
        teamId={team.id}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <ConfirmModal
        variant="delete"
        isOpen={isOpenModalConfirm}
        title="Delete Team"
        description="Are you sure you want to delete this team?"
        onCancel={() => setIsOpenModalConfirm(false)}
        onConfirm={() => handleDeleteTeam(team.id)}
        loading={false}
      />
    </>
  );
};
