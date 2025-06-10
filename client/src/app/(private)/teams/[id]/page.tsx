'use client';

import {
  ChartSpline,
  House,
  Menu,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { useParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useAgreementsQuery } from '@/features/health-check/hooks/agreements/use-agreements-query';
import { useIssuesQuery } from '@/features/health-check/hooks/issues/use-issues-query';
import { useGetActionItemsByTeamId } from '@/features/health-check/hooks/use-get-action-items-by-team-id';
import { useGetHealthChecksByTeam } from '@/features/health-check/hooks/use-get-healt-checks-by-team';
import { useTemplates } from '@/features/health-check/hooks/use-health-check-templates';
import { HealthCheck } from '@/features/health-check/types/health-check';
import { Template } from '@/features/health-check/types/templates';
import { splitHealthChecksByTemplateId } from '@/features/health-check/utils/health-checks';
import { sortTemplatesByLatestHealthCheck } from '@/features/health-check/utils/template';
import DataTrackTab from '@/features/workspace/components/team-tabs/data-track';
import HealthChecksTab from '@/features/workspace/components/team-tabs/health-checks-tab';
import HomeTab from '@/features/workspace/components/team-tabs/home-tab';
import MembersTab from '@/features/workspace/components/team-tabs/members-tab';
import { SettingsTab } from '@/features/workspace/components/team-tabs/settings-tab';
import {
  TEAM_ROLES,
  WORKSPACE_ROLES,
} from '@/features/workspace/constants/user';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamUser } from '@/features/workspace/hooks/use-get-team-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';

const TABS_VALUES = {
  HOME: 'home',
  HEALTH_CHECKS: 'health-checks',
  MEMBERS: 'members',
  DATA_TRACK: 'data-track',
  SETTINGS: 'settings',
};

const TeamPage = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const { data: actionItems = [] } = useGetActionItemsByTeamId(teamId);
  const { data: agreements = [] } = useAgreementsQuery(teamId);

  const { data: issues = [] } = useIssuesQuery(teamId);
  const { data: scrumHealthChecks = [] } = useGetHealthChecksByTeam(teamId);
  const { data: templates = [] } = useTemplates();

  const healthChecksGrouped = splitHealthChecksByTemplateId(
    templates as Template[],
    scrumHealthChecks as HealthCheck[],
  );

  const sortedTemplates = sortTemplatesByLatestHealthCheck(
    templates as Template[],
    scrumHealthChecks as HealthCheck[],
  );

  const { data: team } = useGetTeam(teamId);
  const { data: currentUser } = useCurrentUser();

  const { data: teamUser } = useGetTeamUser(teamId, currentUser?.id || '');
  const { data: workspaceUser } = useGetWorkspaceUser(
    team?.workspace_id || '',
    currentUser?.id || '',
  );

  const isAdmin =
    teamUser?.role === TEAM_ROLES.admin ||
    workspaceUser?.role === WORKSPACE_ROLES.owner ||
    workspaceUser?.role === WORKSPACE_ROLES.admin;

  const TABS = [
    {
      value: TABS_VALUES.HOME,
      icon: House,
      label: 'Home',
      content: (
        <HomeTab
          teamId={teamId}
          actionItems={actionItems}
          agreements={agreements}
          issues={issues}
        />
      ),
    },
    {
      value: TABS_VALUES.HEALTH_CHECKS,
      icon: Menu,
      label: 'Health Checks',
      content: (
        <HealthChecksTab
          healthChecksGrouped={healthChecksGrouped}
          isAdmin={isAdmin}
        />
      ),
    },
    {
      value: TABS_VALUES.MEMBERS,
      icon: UserIcon,
      label: 'Members',
      content: (
        <MembersTab
          teamId={teamId}
          isAdmin={isAdmin}
          currentUserRole={teamUser?.role as WORKSPACE_ROLES}
        />
      ),
    },
    {
      value: TABS_VALUES.DATA_TRACK,
      icon: ChartSpline,
      label: 'Data Track',
      content: (
        <DataTrackTab
          agreements={agreements}
          issues={issues}
          actionItems={actionItems}
          scrumHealthChecks={scrumHealthChecks}
          templates={sortedTemplates}
          healthChecksGrouped={healthChecksGrouped}
        />
      ),
    },
    {
      value: TABS_VALUES.SETTINGS,
      icon: Settings,
      label: 'Settings',
      content: <SettingsTab teamId={teamId} />,
    },
  ];

  return (
    <Tabs defaultValue={TABS_VALUES.HOME} className="w-full p-4 md:p-6 lg:p-8">
      <TabsList className="grid w-full grid-cols-5">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="cursor-pointer"
          >
            <tab.icon className="size-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="pt-10">{tab.content}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TeamPage;
