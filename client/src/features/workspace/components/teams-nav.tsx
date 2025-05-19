'use client';

import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Team } from '../types/team';

interface NavTeamsProps {
  teams: Team[];
}

const NavTeams = ({ teams }: NavTeamsProps) => {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Teams</SidebarGroupLabel>
      <SidebarMenu>
        {teams?.map((team) => (
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
                  className="cursor-pointer"
                >
                  <Users />
                  <span>{team.name}</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavTeams;
