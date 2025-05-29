'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const pathname = usePathname();

  const { data: currentUser, isLoading } = useCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const base = `/workspaces/${currentWorkspace?.workspace_id}`;

  const links = [
    { href: `${base}`, label: 'Home' },
    { href: `${base}/teams`, label: 'Teams' },
    { href: `${base}/users`, label: 'Users' },
    { href: `${base}/settings`, label: 'Settings' }, // fix duplicate href with Home
  ];

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
    <header className="relative w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="lg:max-w-screen-3xl flex w-full items-center justify-start gap-3 p-3">
        <SidebarTrigger />
        <div className="flex w-full items-center justify-between">
          <Link href={base} className="flex items-center gap-2">
            <div className="flex aspect-square size-7 items-center justify-center rounded-lg font-bold text-white sm:size-8">
              <WorkspaceLogo name={String(currentWorkspace?.workspace?.name)} />
            </div>
            <div className="truncate">
              <span className="text-lg font-semibold sm:text-xl">
                {currentWorkspace?.workspace?.name}
              </span>
            </div>
          </Link>

          {currentWorkspace?.workspace_id && pathname.includes(base) && (
            <>
              <Select
                value={pathname}
                onValueChange={(value) => router.push(value)}
              >
                <SelectTrigger className="text-ces-orange-500 w-24 rounded-none border-none bg-transparent text-base font-semibold focus:bg-transparent focus:ring-0 focus:ring-offset-0 focus:outline-none sm:hidden">
                  <SelectValue placeholder="Home" />
                </SelectTrigger>
                <SelectContent sideOffset={-5} className="rounded-sm">
                  {links.map(({ href, label }) => (
                    <SelectItem key={label} value={href} className="">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <nav className="hidden flex-wrap gap-3 sm:flex sm:gap-4 md:gap-5">
                {links.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className={cn(
                      'text-sm text-gray-500 hover:text-black sm:text-base',
                      {
                        'text-ces-orange-500 hover:text-ces-orange-500 font-bold':
                          pathname === href,
                      },
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </>
          )}

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
    </header>
  );
}
