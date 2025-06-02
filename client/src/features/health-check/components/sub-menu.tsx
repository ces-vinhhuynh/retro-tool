import {
  BadgeAlert,
  ChartNoAxesColumn,
  CircleCheck,
  Handshake,
  Settings,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';

import { useAgreementMutation } from '../hooks/agreements/use-agreements-mutation';
import { useIssuesMutation } from '../hooks/issues/use-issues-mutation';
import { useHealthCheckMutations } from '../hooks/use-health-check';
import { useSubMenuStore } from '../stores/sub-menu-store';
import { HealthCheckSettings } from '../types/health-check';
import { SUBMENU_ITEMS } from '../utils/constants';

import DisplayModeDialog from './setting-dialog';
import TeamActions from './team-actions';
import TeamAgreements from './team-agreements';
import TeamIssues from './team-issues';
import UserSidebar from './user-sidebar';

const SubMenu = () => {
  const {
    selectedSubmenu,
    setSelectedSubmenu,
    teamMembers,
    issues,
    agreements,
    actionItems,
    healthCheck,
    isFacilitator,
  } = useSubMenuStore();

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

  const { updateHealthCheck } = useHealthCheckMutations();

  const handleCreateAgreement = (title: string) => {
    createAgreements({
      title,
      team_id: healthCheck.team_id,
      health_check_id: healthCheck.id,
    });
  };

  const handleDeleteAgreement = (id: string) => {
    deleteAgreements(id);
  };

  const handleCreateIssue = (title: string) => {
    createIssue({
      title,
      team_id: healthCheck.team_id,
      health_check_id: healthCheck.id,
    });
  };

  const handleDeleteIssue = (id: string) => {
    deleteIssue(id);
  };

  const handleUpdateHealthCheckSettings = (settings: HealthCheckSettings) => {
    updateHealthCheck({
      id: healthCheck.id,
      healthCheck: { settings },
    });
  };

  if (!isFacilitator) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="top-0 right-0 flex h-full flex-row overflow-hidden border border-gray-200 bg-white">
        {selectedSubmenu === SUBMENU_ITEMS.PROGRESS_BAR && (
          <UserSidebar
            healthCheck={healthCheck}
            isOpen={selectedSubmenu === SUBMENU_ITEMS.PROGRESS_BAR}
            healthCheckId={healthCheck.id}
          />
        )}
        {selectedSubmenu === SUBMENU_ITEMS.ACTIONS && (
          <TeamActions
            actionItems={actionItems}
            teamId={healthCheck.team_id ?? ''}
            healthCheckId={healthCheck.id}
            teamMembers={teamMembers}
          />
        )}
        {selectedSubmenu === SUBMENU_ITEMS.AGREEMENT && (
          <TeamAgreements
            isOpen={selectedSubmenu === SUBMENU_ITEMS.AGREEMENT}
            agreements={agreements}
            handleCreateAgreement={handleCreateAgreement}
            handleDeleteAgreement={handleDeleteAgreement}
            isLoadingAgreements={isLoadingAgreements}
          />
        )}
        {selectedSubmenu === SUBMENU_ITEMS.ISSUES && (
          <TeamIssues
            issues={issues}
            handleCreateIssue={handleCreateIssue}
            handleDeleteIssue={handleDeleteIssue}
            isLoadingIssues={isLoadingIssues}
          />
        )}

        <div className="flex w-24 flex-col gap-8 border border-gray-200 bg-white px-2 py-6">
          {menuItems.map((item) =>
            item.value === SUBMENU_ITEMS.CUSTOMIZE ? (
              <DisplayModeDialog
                key={item.value}
                settings={healthCheck.settings as HealthCheckSettings}
                onChange={handleUpdateHealthCheckSettings}
                trigger={
                  <Button
                    variant="ghost"
                    className="hover:text-ces-orange-500 flex w-full cursor-pointer flex-col items-center gap-2 text-gray-600 hover:bg-white"
                  >
                    {item.icon}
                    <span className="text-xs">{item.name}</span>
                  </Button>
                }
              />
            ) : (
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
            ),
          )}
        </div>
      </SidebarContent>
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
  {
    name: 'Customize',
    icon: <Settings size={15} />,
    value: SUBMENU_ITEMS.CUSTOMIZE,
  },
];
