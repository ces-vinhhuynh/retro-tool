'use client';

import type * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import NavTeams from '@/features/workspace/components/teams-nav';
import { WorkspaceSwitcher } from '@/features/workspace/components/workspace-switcher';
import { WorkspaceUserWithWorkspace } from '@/features/workspace/types/workspace-users';
import { Team } from '@/types/team';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  workspaces: WorkspaceUserWithWorkspace[];
  currentWorkspace: WorkspaceUserWithWorkspace;
  teams: Team[];
};

export function AppSidebar({
  workspaces,
  currentWorkspace,
  teams,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props} className="md:max-lg:hidden">
      <SidebarHeader>
        <WorkspaceSwitcher
          workspaces={workspaces}
          currentWorkspace={currentWorkspace}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavTeams teams={teams} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
