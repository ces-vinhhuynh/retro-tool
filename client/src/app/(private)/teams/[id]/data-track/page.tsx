'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useAgreementsQuery } from '@/features/health-check/hooks/agreements/use-agreements-query';
import { useIssuesQuery } from '@/features/health-check/hooks/issues/use-issues-query';
import {
  useGetActionItemsByTeamId,
  useGetOpenActionItemsByTeamId,
} from '@/features/health-check/hooks/use-get-action-items-by-team-id';
import { useGetHealthChecksByTeam } from '@/features/health-check/hooks/use-get-healt-checks-by-team';
import { useTemplates } from '@/features/health-check/hooks/use-health-check-templates';
import { HealthCheck } from '@/features/health-check/types/health-check';
import { Template } from '@/features/health-check/types/templates';
import { splitHealthChecksByTemplateId } from '@/features/health-check/utils/health-checks';
import { sortTemplatesByLatestHealthCheck } from '@/features/health-check/utils/template';
import DataTrackTab from '@/features/workspace/components/team-tabs/data-track';
import { WORKSPACE_ROLES } from '@/features/workspace/constants/user';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamUser } from '@/features/workspace/hooks/use-get-team-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';
import { useIsMobile } from '@/hooks/use-mobile';

const DataTrackPage = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const router = useRouter();

  // Data fetching for data track
  const { data: actionItems = [] } = useGetOpenActionItemsByTeamId(teamId);
  const { data: agreements = [] } = useAgreementsQuery(teamId);
  const { data: issues = [] } = useIssuesQuery(teamId);
  const { data: scrumHealthChecks = [] } = useGetHealthChecksByTeam(teamId);
  const { data: templates = [] } = useTemplates();

  const isMobile = useIsMobile();

  const healthChecksGrouped = splitHealthChecksByTemplateId(
    templates as Template[],
    scrumHealthChecks as HealthCheck[],
  );

  const sortedTemplates = sortTemplatesByLatestHealthCheck(
    templates as Template[],
    scrumHealthChecks as HealthCheck[],
  );

  // User and team data
  const { data: team } = useGetTeam(teamId);
  const { data: currentUser } = useCurrentUser();

  const { data: error } = useGetTeamUser(teamId, currentUser?.id || '');
  const { data: workspaceUser } = useGetWorkspaceUser(
    team?.workspace_id || '',
    currentUser?.id || '',
  );

  // Permission check
  useEffect(() => {
    if (
      error &&
      workspaceUser?.role !== WORKSPACE_ROLES.owner &&
      workspaceUser?.role !== WORKSPACE_ROLES.admin
    ) {
      router.push(`/workspaces/${workspaceUser?.workspace_id}`);
    }
  }, [error, workspaceUser, router]);

  return (
    <div className="w-full p-2 md:p-6 lg:p-8">
      <DataTrackTab
        agreements={agreements}
        issues={issues}
        actionItems={actionItems}
        scrumHealthChecks={scrumHealthChecks}
        templates={sortedTemplates}
        healthChecksGrouped={healthChecksGrouped}
        teamId={teamId}
        isMobile={isMobile}
      />
    </div>
  );
};

export default DataTrackPage;
