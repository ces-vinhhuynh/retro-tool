'use client';

import { BarChart3, CalendarArrowUp, Settings, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type * as React from 'react';
import { useEffect, useState } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import {
  getLatestHealthCheck,
  LatestHealthCheckData,
  removeLatestHealthCheck,
} from '@/features/health-check/stores/latest-health-check-storage';
import { ProjectSwitcher } from '@/features/workspace/components/project-switcher';
import { WorkspaceSwitcher } from '@/features/workspace/components/workspace-switcher';
import { WorkspaceUserWithWorkspace } from '@/features/workspace/types/workspace-users';
import { Team } from '@/types/team';
import { cn } from '@/utils/cn';

import {
  FLOATING_HEALTH_CHECK_BUTTON,
  PROJECT_NAVIGATION_ITEMS,
} from '../constants';
import { FloatingButton } from '../ui/floating-button';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  workspaces: WorkspaceUserWithWorkspace[];
  currentWorkspace: WorkspaceUserWithWorkspace;
  teams: Team[];
  currentTeam: Team;
  isOwnerOrAdmin: boolean;
};

export function AppSidebar({
  workspaces,
  currentWorkspace,
  teams,
  currentTeam,
  isOwnerOrAdmin,
  ...props
}: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();

  // Get current tab from pathname
  const currentTab = pathname.match(/\/teams\/[^/]+\/([^/]+)/)?.[1] || 'home';

  const isCollapsed = state === 'collapsed';

  // Helper function to close sidebar on mobile before navigation
  const handleNavigationWithClose = (navigationFn: () => void) => {
    if (isMobile) {
      setOpenMobile(false);
    }
    // Small delay to ensure sidebar starts closing before navigation
    setTimeout(navigationFn, 0);
  };

  const [latestHealthCheck, setLatestHealthCheck] =
    useState<LatestHealthCheckData | null>(null);

  const [shouldShowFloatingButton, setShouldShowFloatingButton] =
    useState(false);

  useEffect(() => {
    if (isLoadingUser) return;

    // Check if should show based on currentTab
    const projectTabs = PROJECT_NAVIGATION_ITEMS.map((item) => item.tab);
    const shouldShowBasedOnTab =
      currentTab === 'dashboard' || projectTabs.includes(currentTab);

    if (!shouldShowBasedOnTab) {
      // Use shouldShowFloatingButton separately from latestHealthCheck because we want
      // latestHealthCheck to remain available after the user returns to working on the previous team
      setShouldShowFloatingButton(false);
      return;
    }

    // Check if there's a latest health check
    const checkLatestHealthCheck = () => {
      const latest = getLatestHealthCheck();

      if (
        latest &&
        latest.userId === currentUser?.id &&
        latest?.teamId === currentTeam.id
      ) {
        setLatestHealthCheck(latest);
        setShouldShowFloatingButton(true);
      } else {
        setShouldShowFloatingButton(false);
      }
    };

    checkLatestHealthCheck();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, pathname, currentTab]);

  const onClickFloatingHealthCheckBtn = () => {
    if (latestHealthCheck) {
      router.push(`/health-checks/${latestHealthCheck.healthCheckId}`);
    }
  };

  const onCloseFloatingButton = () => {
    setLatestHealthCheck(null);
    removeLatestHealthCheck();
  };

  // Check if current route is active
  const isProjectItemActive = (tab: string) => {
    return currentTab === tab;
  };

  const handleProjectNavigation = (tab: string) => {
    if (currentTeam) {
      handleNavigationWithClose(() => {
        router.push(`/teams/${currentTeam.id}/${tab}`);
      });
    }
  };

  const handleDataInsightNavigation = () => {
    handleNavigationWithClose(() => {
      router.push(`/workspaces/${currentWorkspace.workspace_id}/data`);
    });
  };

  const handleUsersNavigation = () => {
    handleNavigationWithClose(() => {
      router.push(`/workspaces/${currentWorkspace.workspace_id}/users`);
    });
  };

  return (
    <>
      <Sidebar
        collapsible="icon"
        {...props}
        className="overflow-x-hidden md:max-lg:hidden"
      >
        <SidebarHeader className="overflow-x-hidden p-3">
          {/* Logo */}
          <div className="flex min-w-0 items-center gap-2 px-2 py-1">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-white font-semibold text-blue-600">
              R
            </div>
            {!isCollapsed && (
              <span className="truncate font-semibold text-white">
                Retro App
              </span>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="overflow-x-hidden px-2 py-3">
          {/* Workspace Section */}
          <SidebarGroup className="mb-4 overflow-x-hidden p-0">
            <SidebarGroupLabel className="truncate px-1 font-medium text-blue-200">
              Workspace
            </SidebarGroupLabel>
            <div className="px-1">
              <WorkspaceSwitcher
                workspaces={workspaces}
                currentWorkspace={currentWorkspace}
                onNavigate={handleNavigationWithClose}
              />
            </div>
          </SidebarGroup>

          {/* Project Section */}
          <SidebarGroup className="mb-4 overflow-x-hidden p-0">
            <SidebarGroupLabel className="truncate px-1 font-medium text-blue-200">
              Project
            </SidebarGroupLabel>
            <SidebarMenu className="px-1">
              {/* Project Switcher - Only render when currentTeam exists */}
              <ProjectSwitcher
                teams={teams}
                currentTeam={currentTeam}
                onNavigate={handleNavigationWithClose}
                workspaceId={currentWorkspace?.workspace_id}
                isOwnerOrAdmin={isOwnerOrAdmin}
              />

              {/* Project Navigation Items - Only show when currentTeam exists */}
              {currentTeam && (
                <>
                  {PROJECT_NAVIGATION_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = isProjectItemActive(item.tab);

                    return (
                      <SidebarMenuItem
                        key={item.title}
                        className="w-full overflow-x-hidden"
                      >
                        <SidebarMenuButton
                          onClick={() => handleProjectNavigation(item.tab)}
                          className={cn(
                            'relative w-full min-w-0 cursor-pointer justify-start pr-2 pl-6 text-blue-100 hover:bg-blue-700/50 hover:text-white',
                            isActive &&
                              'border border-blue-300/50 bg-blue-500/30 font-medium text-white shadow-sm hover:bg-blue-500/30 data-[state=open]:hover:bg-blue-500/30 data-[state=open]:hover:text-white',
                          )}
                        >
                          <Icon
                            className={cn(
                              'mr-2 h-4 w-4 flex-shrink-0',
                              isActive ? 'text-white' : 'text-blue-200',
                            )}
                          />
                          <span className="flex-1 truncate">{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </>
              )}
            </SidebarMenu>
          </SidebarGroup>

          {/* Data Insight Section */}
          <SidebarGroup className="overflow-x-hidden p-0">
            <SidebarMenu className="px-1">
              <SidebarMenuItem className="w-full overflow-x-hidden">
                <SidebarMenuButton
                  onClick={handleDataInsightNavigation}
                  className="w-full min-w-0 cursor-pointer justify-start px-2 text-blue-100 hover:bg-blue-700/50 hover:text-white"
                >
                  <BarChart3 className="mr-2 h-4 w-4 flex-shrink-0 text-blue-200" />
                  <span className="flex-1 truncate">Data Insight</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Users Section */}
          <SidebarGroup className="overflow-x-hidden p-0">
            <SidebarMenu className="px-1">
              <SidebarMenuItem className="w-full overflow-x-hidden">
                <SidebarMenuButton
                  onClick={handleUsersNavigation}
                  className="w-full min-w-0 cursor-pointer justify-start px-2 text-blue-100 hover:bg-blue-700/50 hover:text-white"
                >
                  <Users className="mr-2 h-4 w-4 flex-shrink-0 text-blue-200" />
                  <span className="flex-1 truncate">Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Settings Footer */}
        <SidebarFooter className="overflow-x-hidden border-t border-blue-700/50 px-2 py-3">
          <SidebarMenu className="px-1">
            <SidebarMenuItem className="w-full overflow-x-hidden">
              <SidebarMenuButton
                onClick={() => {}}
                className="w-full min-w-0 cursor-pointer justify-start px-2 text-blue-100 hover:bg-blue-700/50 hover:text-white"
              >
                <Settings className="mr-2 h-4 w-4 flex-shrink-0 text-blue-200" />
                <span className="flex-1 truncate">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {shouldShowFloatingButton && latestHealthCheck && (
        <FloatingButton
          name={FLOATING_HEALTH_CHECK_BUTTON.name}
          title={FLOATING_HEALTH_CHECK_BUTTON.title}
          onClick={onClickFloatingHealthCheckBtn}
          onClose={onCloseFloatingButton}
          IconComponent={CalendarArrowUp}
        />
      )}
    </>
  );
}
