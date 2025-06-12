'use client';

import { cn } from '@/utils/cn';

import { HealthCheckRatingFunction } from '../types/chart';
import { FormattedHealthCheck } from '../types/health-check';

import HealthCheckColumn from './health-check-column';
import QuestionRow from './question-row';

interface HealthCheckTableViewProps {
  healthChecks: FormattedHealthCheck[];
  getHealthCheckRatings: HealthCheckRatingFunction;
  isShowAddNew?: boolean;
  onAddNewSession?: () => void;
}

const HealthCheckTableView = ({
  healthChecks,
  getHealthCheckRatings,
  isShowAddNew = false,
  onAddNewSession,
}: HealthCheckTableViewProps) => {
  if (!healthChecks?.length) {
    return null;
  }

  const questions = healthChecks[0]?.questions || [];

  return (
    <div className="flex w-full overflow-x-auto">
      {/* Questions Column - Fixed width */}
      <div
        className={cn('flex-shrink-0', 'w-32 md:w-56 lg:w-68', {
          'w-20': isShowAddNew,
        })}
      >
        <div className="h-24 border-r border-b border-gray-200" />
        {questions.map((question) => (
          <QuestionRow
            key={question.id}
            title={question.title}
            description={question.description}
            isShowAddNew={isShowAddNew}
          />
        ))}
      </div>

      {/* Health Check Columns - Scrollable */}
      <div className="flex-1">
        <div className="flex min-w-max">
          {healthChecks.map((healthCheck) => (
            <HealthCheckColumn
              key={healthCheck.id}
              healthCheck={healthCheck}
              getHealthCheckRatings={getHealthCheckRatings}
            />
          ))}
          {isShowAddNew && (
            <HealthCheckColumn
              onAddNewSession={onAddNewSession}
              healthCheck={healthChecks[0]}
              getHealthCheckRatings={getHealthCheckRatings}
              isShowAddNew={isShowAddNew}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthCheckTableView;
