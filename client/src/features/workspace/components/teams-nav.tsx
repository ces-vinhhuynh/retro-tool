'use client';

import { Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Team } from '@/types/team';
import { cn } from '@/utils/cn';

interface NavTeamsProps {
  teams: Team[];
}

export const NavTeams = ({ teams }: NavTeamsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel>Teams</SidebarGroupLabel>
      <SidebarMenu>
        {teams?.map((team) => {
          const isActive = pathname === `/teams/${team.id}`;

          return (
            <Collapsible
              key={team.id}
              asChild
              defaultOpen={true}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => router.push(`/teams/${team.id}`)}
                    tooltip={team.name}
                    className={cn(
                      'cursor-pointer',
                      isActive &&
                        'bg-rhino-100/70 text-rhino-600 hover:bg-rhino-100/70 data-[state=open]:hover:bg-rhino-100/70 data-[state=open]:hover:text-rhino-600 hover:text-rhino-600 font-medium',
                    )}
                  >
                    <Users className={cn(isActive && 'text-rhino-600')} />
                    <span>{team.name}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
