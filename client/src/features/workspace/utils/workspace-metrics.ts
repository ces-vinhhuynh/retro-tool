import {
  HealthCheck,
  Question,
  AverageScores,
  ActionItem,
} from '@/features/health-check/types/health-check';
import { Template } from '@/features/health-check/types/templates';
import { calcAverage } from '@/features/health-check/utils/score';

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
