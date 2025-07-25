'use client';

import { ChevronsUpDown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
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
import { ProjectLogo } from '@/features/workspace/components/project-logo';
import { Team } from '@/types/team';
import { cn } from '@/utils/cn';

import { CreateTeamDialog } from './create-team-dialog';

interface ProjectSwitcherProps {
  teams: Team[];
  currentTeam?: Team;
  onNavigate?: (navigationFn: () => void) => void;
  workspaceId: string;
  isOwnerOrAdmin: boolean;
}

export function ProjectSwitcher({
  teams,
  currentTeam,
  onNavigate,
  workspaceId,
  isOwnerOrAdmin,
}: ProjectSwitcherProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const handleProjectChange = (projectId: string) => {
    const navigationFn = () => router.push(`/teams/${projectId}`);

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
                {currentTeam ? (
                  <ProjectLogo name={currentTeam.name} />
                ) : (
                  <ProjectLogo name="Select Project" />
                )}
              </div>
              <div className="grid min-w-32 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentTeam?.name || 'Select Project'}
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
              Projects
            </DropdownMenuLabel>
            {teams?.map((team) => {
              const isActive = currentTeam && currentTeam.id === team.id;
              return (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => handleProjectChange(team.id)}
                  className={cn(
                    'cursor-pointer p-2 text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-800',
                    {
                      'bg-blue-100/70 font-semibold text-blue-600 hover:bg-blue-100/70 hover:text-blue-600 focus:bg-blue-100/70 focus:text-blue-600':
                        isActive,
                    },
                  )}
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-300 font-bold text-blue-800">
                    <ProjectLogo name={team.name} />
                  </div>
                  {team.name}
                </DropdownMenuItem>
              );
            })}

            {isOwnerOrAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <CreateTeamDialog workspaceId={workspaceId}>
                    <Button
                      variant="ghost"
                      className="flex justify-start gap-2 p-2 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-800"
                    >
                      <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                        <Plus className="size-4" />
                      </div>
                      <div className="text-muted-foreground font-medium">
                        Add project
                      </div>
                    </Button>
                  </CreateTeamDialog>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
