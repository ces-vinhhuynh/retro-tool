'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { authService } from '@/features/auth/api/auth';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useLocalStorageUtils } from '@/features/health-check/stores/handle-storage';
import { WorkspaceUserWithWorkspace } from '@/features/workspace/types/workspace-users';
import { cn } from '@/lib/utils';
import { Team } from '@/types/team';
import { getAvatarCharacters } from '@/utils/user';

import {
  FLOATING_HEALTH_CHECK_BUTTON,
  LATEST_HEALTH_CHECK_STORAGE_KEY,
} from '../constants';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { SidebarTrigger } from '../ui/sidebar';

import { HealthCheckHeader } from './health-check-header';

interface HeaderProps {
  currentWorkspace: WorkspaceUserWithWorkspace;
  currentTeam: Team;
}

export function Header({ currentWorkspace, currentTeam }: HeaderProps) {
  const pathname = usePathname();

  const { data: currentUser, isLoading } = useCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isTeamRoute =
    pathname.startsWith('/teams/') || pathname.startsWith('/health-checks/');
  const isHealthCheckRoute = pathname.startsWith('/health-checks/');

  const { deleteLocalStoreItems } = useLocalStorageUtils();

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      deleteLocalStoreItems([
        FLOATING_HEALTH_CHECK_BUTTON.name,
        LATEST_HEALTH_CHECK_STORAGE_KEY,
      ]);
      await authService.logout();
      // Hard redirects and clears ALL React state automatically
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="relative w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="lg:max-w-screen-3xl flex w-full items-center justify-start gap-3 p-3">
        <SidebarTrigger />
        <div className="flex w-full items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList className="text-lg font-medium text-gray-800 sm:text-xl">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/workspaces/${currentWorkspace?.workspace_id}`}
                  className={cn(
                    'font-medium text-gray-800 hover:text-gray-800',
                    {
                      'text-gray-400 hover:text-gray-500': isTeamRoute,
                    },
                  )}
                >
                  {currentWorkspace?.workspace?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {currentTeam?.id && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={`/teams/${currentTeam?.id}`}
                      className="font-medium text-gray-800 hover:text-gray-800"
                    >
                      {currentTeam?.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          {isLoading && (
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200 sm:h-9 sm:w-36 dark:bg-gray-700"></div>
          )}
          {!isLoading && currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden flex-col text-right sm:flex">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {currentUser.user_metadata?.full_name || 'User'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser.email}
                </span>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer sm:h-9 sm:w-9">
                    {currentUser.user_metadata?.avatar_url ? (
                      <AvatarImage
                        src={currentUser.user_metadata.avatar_url}
                        alt={currentUser.user_metadata?.full_name ?? 'User'}
                      />
                    ) : (
                      <AvatarFallback>
                        {getAvatarCharacters(
                          currentUser.user_metadata?.full_name || 'U',
                        )}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2 sm:w-48" align="end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className={cn(
                      'w-full justify-start text-sm text-gray-500 hover:text-gray-700 sm:text-base dark:text-gray-400 dark:hover:text-gray-200',
                      {
                        'cursor-not-allowed opacity-50': isLoggingOut,
                      },
                    )}
                  >
                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
      {isHealthCheckRoute && <HealthCheckHeader />}
    </header>
  );
}
