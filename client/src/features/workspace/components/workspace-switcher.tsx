'use client';

import { ChevronsUpDown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/utils/cn';

import { WorkspaceUserWithWorkspace } from '../types/workspace-users';

import WorkspaceLogo from './workspace-logo';

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceUserWithWorkspace[];
  currentWorkspace: WorkspaceUserWithWorkspace;
  onNavigate?: (navigationFn: () => void) => void;
}

export function WorkspaceSwitcher({
  workspaces,
  currentWorkspace,
  onNavigate,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const handleWorkspaceChange = (workspaceId: string) => {
    const navigationFn = () => router.push(`/workspaces/${workspaceId}`);

    if (onNavigate) {
      onNavigate(navigationFn);
    } else {
      navigationFn();
    }
  };

  const handleCreateWorkspace = () => {
    const navigationFn = () => router.push('/workspaces/create');

    if (onNavigate) {
      onNavigate(navigationFn);
    } else {
      navigationFn();
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="border-none ring-0 ring-offset-0 outline-none"
          >
            <SidebarMenuButton
              size="lg"
              className={cn(
                'h-max bg-white/5 p-0 text-blue-100 ring-0 ring-offset-0 transition-all duration-200 ease-in-out hover:bg-blue-500/30 hover:text-white focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:bg-blue-600 data-[state=open]:text-white',
              )}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-300 font-bold text-blue-800">
                <WorkspaceLogo
                  name={String(currentWorkspace?.workspace?.name)}
                />
              </div>
              <div className="grid min-w-32 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentWorkspace?.workspace?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto text-blue-200" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex w-[--radix-dropdown-menu-trigger-width] min-w-56 flex-col gap-1 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {workspaces?.map((workspace) => {
              const isActive =
                currentWorkspace?.workspace_id === workspace.workspace_id;
              return (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => handleWorkspaceChange(workspace.workspace_id)}
                  className={cn(
                    'cursor-pointer p-2 text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-800',
                    {
                      'bg-blue-100/70 font-semibold text-blue-600 hover:bg-blue-100/70 hover:text-blue-600 focus:bg-blue-100/70 focus:text-blue-600':
                        isActive,
                    },
                  )}
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-300 font-bold text-blue-800">
                    <WorkspaceLogo name={String(workspace?.workspace?.name)} />
                  </div>
                  {workspace?.workspace?.name}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 p-2 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-800"
              onClick={handleCreateWorkspace}
            >
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
