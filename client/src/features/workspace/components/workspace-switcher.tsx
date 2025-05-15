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
}

export function WorkspaceSwitcher({
  workspaces,
  currentWorkspace,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const handleWorkspaceChange = (workspace: WorkspaceUserWithWorkspace) => {
    router.push(`/workspaces/${workspace.workspace.id}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200 ease-in-out',
              )}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg font-bold text-white">
                <WorkspaceLogo
                  name={String(currentWorkspace?.workspace?.name)}
                />
              </div>
              <div className="grid min-w-32 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentWorkspace?.workspace?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {workspaces?.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => handleWorkspaceChange(workspace)}
                className="gap-2 p-2"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg font-bold text-white">
                  <WorkspaceLogo name={String(workspace?.workspace?.name)} />
                </div>
                {workspace?.workspace?.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
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
