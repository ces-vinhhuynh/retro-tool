import {
  HealthCheck,
  Question,
  AverageScores,
  ActionItem,
} from '@/features/health-check/types/health-check';
import { Template } from '@/features/health-check/types/templates';
import { calcAverage } from '@/features/health-check/utils/score';
import { Team } from '@/types/team';

const isValidAverageScore = (score: AverageScores) => {
  return (
    typeof score === 'object' &&
    score !== null &&
    !Array.isArray(score) &&
    Object.keys(score).length > 0
  );
};

export const calcWorkspaceTeamHealthMetrics = (
  allHealthChecks: HealthCheck[],
  templates: Template[],
) => {
  if (!allHealthChecks.length) {
    return {
      currentAverage: 0,
      previousAverage: 0,
      percentageChange: 0,
    };
  }

  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentHealthChecks = allHealthChecks.filter((hc) => {
    const hcDate = new Date(hc.created_at || '');
    return hcDate >= currentMonth;
  });

  const previousHealthChecks = allHealthChecks.filter((hc) => {
    const hcDate = new Date(hc.created_at || '');
    return hcDate >= previousMonth && hcDate < currentMonth;
  });

  const getCurrentAverage = (healthChecks: HealthCheck[]) => {
    const validHealthChecks = healthChecks.filter((healthCheck) =>
      isValidAverageScore(healthCheck.average_score as AverageScores),
    );
    if (!validHealthChecks.length) return 0;

    const teamAverages = validHealthChecks.map((healthCheck) => {
      const scores = healthCheck.average_score as AverageScores;
      const template = templates.find(
        (t) => t.id === healthCheck.template_id,
      ) as Template;
      if (!template?.questions || !scores) return 0;
      if (!Array.isArray(template.questions)) return 0;
      return parseFloat(calcAverage(template.questions as Question[], scores));
    });

    const totalAverage =
      teamAverages.reduce((sum, avg) => sum + avg, 0) / teamAverages.length;
    return (totalAverage / 10) * 100;
  };

  const currentAverage = getCurrentAverage(currentHealthChecks);
  const previousAverage = getCurrentAverage(previousHealthChecks);
  const percentageChange =
    previousAverage > 0
      ? ((currentAverage - previousAverage) / previousAverage) * 100
      : 0;

  return {
    currentAverage: Math.round(currentAverage),
    previousAverage: Math.round(previousAverage),
    percentageChange: Math.round(percentageChange * 100) / 100,
  };
};

export const calcWorkspaceActionItemsMetrics = (
  allActionItems: ActionItem[],
) => {
  const completed = allActionItems.filter(
    (item) => item.status === 'done',
  ).length;
  const total = allActionItems.length;
  const inProgress = total - completed;

  return {
    inProgress,
    completed,
    total,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};

export const getWorkspaceHealthTrendChartData = (
  healthChecks: HealthCheck[],
  templates: Template[],
  teams: Team[],
) => {
  if (!healthChecks?.length || !templates?.length || !teams?.length) return [];

  // Group health checks by month and team
  const monthlyTeamData: {
    [monthKey: string]: { [teamId: string]: number[] };
  } = {};

  healthChecks.forEach((hc) => {
    if (!hc.created_at || !hc.team_id || !hc.template_id) return;
    const date = new Date(hc.created_at);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const template = templates.find((t) => t.id === hc.template_id);
    if (!template?.questions || !hc.average_score) return;
    // Calculate health check average (0-10 scale)
    const avgScore = parseFloat(
      calcAverage(
        template.questions as Question[],
        hc.average_score as AverageScores,
      ),
    );
    if (!monthlyTeamData[monthKey]) {
      monthlyTeamData[monthKey] = {};
    }
    if (!monthlyTeamData[monthKey][hc.team_id]) {
      monthlyTeamData[monthKey][hc.team_id] = [];
    }
    monthlyTeamData[monthKey][hc.team_id].push(avgScore);
  });

  // Convert to chart data format
  const chartPoints = Object.entries(monthlyTeamData)
    .map(([monthKey, teamData]) => {
      const [year, month] = monthKey.split('-').map(Number);
      const date = new Date(year, month, 1);
      const dataPoint: { [teamName: string]: number | string | Date } = {
        month: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        }),
        date,
      };
      // Calculate average for each team in this month
      teams.forEach((team) => {
        const teamScores = teamData[team.id] || [];
        if (teamScores.length > 0) {
          const teamAverage =
            teamScores.reduce((sum, score) => sum + score, 0) /
            teamScores.length;
          dataPoint[team.name] = Math.round((teamAverage / 10) * 100);
        }
      });
      return dataPoint;
    })
    .sort((a, b) => (a.date as Date).getTime() - (b.date as Date).getTime())
    .slice(-12);

  return chartPoints;
};

export const calculateTeamAverage = (
  healthChecks: HealthCheck[],
  templates: Template[],
) => {
  if (!healthChecks?.length || !templates?.length) return 0;

  const avgScores: number[] = [];

  healthChecks.forEach((hc) => {
    if (!hc.created_at || !hc.team_id || !hc.template_id) return;

    const template = templates.find((t) => t.id === hc.template_id);
    if (!template?.questions || !hc.average_score) return;
    // Calculate health check average (0-10 scale)
    const avgScore = parseFloat(
      calcAverage(
        template.questions as Question[],
        hc.average_score as AverageScores,
      ),
    );

    avgScores.push(avgScore / 10);
  });

  return avgScores.length > 0
    ? avgScores.reduce((sum, score) => sum + score, 0) / avgScores.length
    : 0;
};
