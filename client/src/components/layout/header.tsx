'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import WorkspaceLogo from '@/features/workspace/components/workspace-logo';
import { WorkspaceUserWithWorkspace } from '@/features/workspace/types/workspace-users';
import { cn } from '@/lib/utils';
import { getAvatarCharacters } from '@/utils/user';

import { SidebarTrigger } from '../ui/sidebar';

interface HeaderProps {
  currentWorkspace: WorkspaceUserWithWorkspace;
}

export function Header({ currentWorkspace }: HeaderProps) {
  const router = useRouter();
  const { data: currentUser, isLoading } = useCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <header className="relative border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <SidebarTrigger className="absolute top-1/2 -translate-y-1/2" />
      <div className="max-w-screen-3xl container mx-auto flex w-full items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg font-bold text-white">
            <WorkspaceLogo name={String(currentWorkspace?.workspace?.name)} />
          </div>
          <div className="">
            <span className="px-2 text-xl font-semibold">
              {currentWorkspace?.workspace?.name}
            </span>
          </div>
        </div>

        {isLoading && (
          <div className="h-9 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        )}
        {!isLoading && currentUser ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {currentUser.user_metadata?.full_name ??
                  currentUser.email?.split('@')[0] ??
                  'User'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {currentUser.email}
              </span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  {currentUser.user_metadata?.avatar_url ? (
                    <AvatarImage
                      src={currentUser.user_metadata.avatar_url}
                      alt={currentUser.user_metadata?.full_name ?? 'User'}
                    />
                  ) : (
                    <AvatarFallback>
                      {getAvatarCharacters(
                        currentUser.user_metadata?.full_name ??
                          currentUser.email ??
                          'U',
                      )}
                    </AvatarFallback>
                  )}
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className={cn(
                    'w-full justify-start text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
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
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
