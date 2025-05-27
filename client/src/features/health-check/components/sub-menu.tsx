import {
  BadgeAlert,
  ChartNoAxesColumn,
  CircleCheck,
  Handshake,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar';

import { useAgreementMutation } from '../hooks/agreements/use-agreements-mutation';
import { useIssuesMutation } from '../hooks/issues/use-issues-mutation';
import { useSubMenuStore } from '../stores/sub-menu-store';
import { Agreement } from '../types/agreements';
import {
  ActionItemWithAssignees,
  HealthCheck,
  User,
} from '../types/health-check';
import { Issue } from '../types/issues';
import { SUBMENU_ITEMS } from '../utils/constants';

import TeamActions from './team-actions';
import TeamAgreements from './team-agreements';
import TeamIssues from './team-issues';
import UserSidebar from './user-sidebar';

interface SubMenuProps {
  agreements: Agreement[];
  issues: Issue[];
  actionItems: ActionItemWithAssignees[];
  healthCheckId: string;
  healthCheck: HealthCheck;
  teamId: string;
  teamMembers: User[];
}

const SubMenu = ({
  agreements,
  issues,
  healthCheck,
  healthCheckId,
  actionItems,
  teamId,
  teamMembers,
}: SubMenuProps) => {
  const { selectedSubmenu, setSelectedSubmenu } = useSubMenuStore();

  const {
    createAgreements,
    deleteAgreements,
    isLoading: isLoadingAgreements,
  } = useAgreementMutation();

  const {
    createIssue,
    deleteIssue,
    isLoading: isLoadingIssues,
  } = useIssuesMutation();

  const handleCreateAgreement = (title: string) => {
    createAgreements({
      title,
      team_id: teamId,
      health_check_id: healthCheck.id,
    });
  };

  const handleDeleteAgreement = (id: string) => {
    deleteAgreements(id);
  };

  const handleCreateIssue = (title: string) => {
    createIssue({
      title,
      team_id: teamId,
      health_check_id: healthCheck.id,
    });
  };

  const handleDeleteIssue = (id: string) => {
    deleteIssue(id);
  };

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
        teamMembers={teamMembers}
      />
      <TeamAgreements
        isOpen={selectedSubmenu === SUBMENU_ITEMS.AGREEMENT}
        agreements={agreements}
        handleCreateAgreement={handleCreateAgreement}
        handleDeleteAgreement={handleDeleteAgreement}
        isLoadingAgreements={isLoadingAgreements}
      />
      <TeamIssues
        isOpen={selectedSubmenu === SUBMENU_ITEMS.ISSUES}
        issues={issues}
        handleCreateIssue={handleCreateIssue}
        handleDeleteIssue={handleDeleteIssue}
        isLoadingIssues={isLoadingIssues}
      />
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
