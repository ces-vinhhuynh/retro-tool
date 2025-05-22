import {
  BadgeAlert,
  ChartNoAxesColumn,
  CircleCheck,
  Handshake,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar';

import { useSubMenuStore } from '../stores/sub-menu-store';
import { ActionItem, HealthCheck } from '../types/health-check';
import { SUBMENU_ITEMS } from '../utils/constants';

import TeamActions from './team-actions';
import TeamAgreements from './team-agreements';
import TeamIssues from './team-issues';
import UserSidebar from './user-sidebar';

interface SubMenuProps {
  actionItems: ActionItem[];
  healthCheckId: string;
  healthCheck: HealthCheck;
  teamId: string;
}
const SubMenu = ({
  healthCheck,
  healthCheckId,
  actionItems,
  teamId,
}: SubMenuProps) => {
  const { selectedSubmenu, setSelectedSubmenu } = useSubMenuStore();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="sticky top-0 right-0 h-full w-22 overflow-hidden border border-gray-200 bg-white p-6">
        <div className="flex w-full flex-col gap-8">
          {menuItems.map((item) => (
            <Button
              key={item.value}
              variant={'ghost'}
              className="hover:text-ces-orange-500 flex w-full cursor-pointer flex-col items-center gap-2 text-gray-600 hover:bg-white"
              onClick={() => {
                setSelectedSubmenu(
                  selectedSubmenu === item.value ? '' : item.value,
                );
              }}
            >
              {item.icon}
              <span className="text-xs">{item.name}</span>
            </Button>
          ))}
        </div>
      </SidebarContent>
      <UserSidebar
        healthCheck={healthCheck}
        isOpen={selectedSubmenu === SUBMENU_ITEMS.PROGRESS_BAR}
        healthCheckId={healthCheckId}
      />
      <TeamActions
        isOpen={selectedSubmenu === SUBMENU_ITEMS.ACTIONS}
        actionItems={actionItems}
        teamId={teamId}
        healthCheckId={healthCheckId}
      />
      <TeamAgreements isOpen={selectedSubmenu === SUBMENU_ITEMS.AGREEMENT} />
      <TeamIssues isOpen={selectedSubmenu === SUBMENU_ITEMS.ISSUES} />
      <SidebarRail />
    </Sidebar>
  );
};

export default SubMenu;

const menuItems = [
  {
    name: 'Progress',
    icon: <ChartNoAxesColumn size={15} />,
    value: SUBMENU_ITEMS.PROGRESS_BAR,
  },
  {
    name: 'Actions',
    icon: <CircleCheck size={15} />,
    value: SUBMENU_ITEMS.ACTIONS,
  },
  {
    name: 'Agreements',
    icon: <Handshake size={15} />,
    value: SUBMENU_ITEMS.AGREEMENT,
  },
  {
    name: 'Issues',
    icon: <BadgeAlert size={15} />,
    value: SUBMENU_ITEMS.ISSUES,
  },
];
