'use client';

import {
  QuestionData,
  ScoreRange,
  HealthCheckRatingFunction,
} from '../types/chart';
import { FormattedHealthCheck } from '../types/health-check';

import { HealthCheckBreakdownHeader } from './health-check-breakdown-header';
import { HealthCheckChartRow } from './health-check-chart-row';

interface HealthCheckBreakdownViewProps {
  healthChecks: FormattedHealthCheck[];
  questionData: QuestionData[];
  scoreRange: ScoreRange;
  isShowAddNew?: boolean;
  onAddNewSession?: () => void;
  getRatings?: HealthCheckRatingFunction;
}

export const HealthCheckBreakdownView = ({
  healthChecks,
  questionData,
  scoreRange,
  isShowAddNew = false,
  onAddNewSession,
  getRatings,
}: HealthCheckBreakdownViewProps) => {
  const sprintToHealthCheckId = new Map<string, string>();
  healthChecks.forEach((hc) => {
    sprintToHealthCheckId.set(hc.title, hc.id);
  });

  const getRatingsForChart = (sprintName: string, questionId: string) => {
    const healthCheckId = sprintToHealthCheckId.get(sprintName);
    if (!healthCheckId || !getRatings) return [];
    return getRatings(healthCheckId, questionId);
  };

  // Calculate grid width based on number of health checks
  const totalColumns = isShowAddNew
    ? healthChecks.length + 1
    : healthChecks.length;
  const minWidth = Math.max(totalColumns * 100, 400);

  return (
    <div className="flex w-full flex-col">
      <div className="relative overflow-x-auto">
        <div style={{ minWidth: `${minWidth}px` }}>
          <HealthCheckBreakdownHeader
            healthChecks={healthChecks}
            isShowAddNew={isShowAddNew}
            onAddNewSession={onAddNewSession}
          />

          {questionData.map((question) => (
            <HealthCheckChartRow
              key={question.id}
              question={question}
              scoreRange={scoreRange}
              healthCheckCount={healthChecks.length}
              isShowAddNew={isShowAddNew}
              getRatings={getRatingsForChart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
