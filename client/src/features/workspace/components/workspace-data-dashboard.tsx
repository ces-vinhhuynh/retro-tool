'use client';

import { useGetActionItemsByWorkspace } from '@/features/health-check/hooks/use-get-action-items-by-workspace';
import { useGetHealthChecksByWorkspace } from '@/features/health-check/hooks/use-get-health-checks-by-workspace';
import { useTemplates } from '@/features/health-check/hooks/use-health-check-templates';
import { useGetTeamsByWorkspace } from '@/features/workspace/hooks/use-get-teams-by-workspace';

import {
  calcWorkspaceTeamHealthMetrics,
  calcWorkspaceActionItemsMetrics,
} from '../utils/workspace-metrics';

import WorkspaceStatCard from './workspace-stat-card';

interface WorkspaceDataDashboardProps {
  workspaceId: string;
}

const WorkspaceDataDashboard = ({
  workspaceId,
}: WorkspaceDataDashboardProps) => {
  const { data: teams = [] } = useGetTeamsByWorkspace(workspaceId);
  const { data: allHealthChecks = [] } =
    useGetHealthChecksByWorkspace(workspaceId);
  const { data: allActionItems = [] } = useGetActionItemsByWorkspace(
    teams.map((team) => team.id),
  );
  const { data: templates = [] } = useTemplates();

  const { currentAverage, percentageChange } = calcWorkspaceTeamHealthMetrics(
    allHealthChecks,
    templates,
  );

  const {
    inProgress: actionItemsInProgress,
    completed: actionItemsCompleted,
    total: actionItemsTotal,
  } = calcWorkspaceActionItemsMetrics(allActionItems);

  const teamsCount = teams.length;

  return (
    <div className="flex flex-col gap-8">
      <WorkspaceStatCard
        currentAverage={currentAverage}
        percentageChange={percentageChange}
        teamsCount={teamsCount}
        actionItemsInProgress={actionItemsInProgress}
        actionItemsCompleted={actionItemsCompleted}
        actionItemsTotal={actionItemsTotal}
      />
    </div>
  );
};

export default WorkspaceDataDashboard;
