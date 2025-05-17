import { Plus } from 'lucide-react';

import { cn } from '@/utils/cn';

import { FormattedHealthCheck } from '../types/health-check';

import RatingDisplay from './rating-display';
type Rating = {
  score: number;
  count: number;
};

interface HealthCheckColumnProps {
  healthCheck: FormattedHealthCheck;
  getHealthCheckRatings: (
    healthCheckId: string,
    questionId: string,
  ) => Rating[];
  isShowAddNew?: boolean;
}

const HealthCheckColumn = ({
  healthCheck,
  getHealthCheckRatings,
  isShowAddNew = false,
}: HealthCheckColumnProps) => {
  return (
    <div
      key={healthCheck.id}
      className={cn(
        'flex w-[100px] flex-col border transition-transform duration-200 hover:scale-105 sm:w-[140px] md:w-[210px]',
        {
          'bg-blue-50 cursor-pointer': isShowAddNew,
        },
      )}
    >
      <div
        className={cn(
          'flex h-24 flex-col items-center justify-center gap-1 border-b bg-gray-50',
          {
            'border border-blue-200 bg-blue-50': isShowAddNew,
          },
        )}
      >
        {isShowAddNew ? (
          <div className="flex flex-col items-center gap-2">
            <Plus className="h-6 w-6 text-blue-400" />
            <h2 className="text-lg font-medium text-blue-400">Start New</h2>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold">{healthCheck.title}</h2>
            <p className="text-sm text-gray-500">
              {new Date(String(healthCheck.createdAt)).toLocaleDateString()}
            </p>
            <div className="rounded bg-gray-200 px-2 text-xs capitalize">
              {healthCheck?.status}
            </div>
          </>
        )}
      </div>
      {healthCheck.questions.map((item) => (
        <RatingDisplay
          key={item.id}
          questionId={item.id}
          healthCheckId={healthCheck.id}
          averageScore={item.averageScore}
          getRatings={getHealthCheckRatings}
          isShowAddNew={isShowAddNew}
        />
      ))}
    </div>
  );
};

export default HealthCheckColumn;
