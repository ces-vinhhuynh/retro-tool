import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
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
  onAddNewSession?: () => void;
}

const HealthCheckColumn = ({
  healthCheck,
  getHealthCheckRatings,
  isShowAddNew = false,
  onAddNewSession,
}: HealthCheckColumnProps) => {
  return (
    <div
      key={healthCheck.id}
      className={cn(
        'flex min-w-24 max-w-56 w-full flex-col border transition-transform duration-200',
        {
          'cursor-pointer bg-blue-50': isShowAddNew,
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
          <Button
            variant={'ghost'}
            className="flex flex-col items-center gap-2 hover:bg-blue-50"
            onClick={onAddNewSession}
          >
            <Plus className="h-6 w-6 text-blue-400" />
            <h2 className="text-lg font-medium text-blue-400">Start New</h2>
          </Button>
        ) : (
          <Link
            href={`/health-checks/${healthCheck.id}`}
            className="flex w-full flex-col items-center gap-2"
          >
            <h2 className="text-lg font-bold">{healthCheck.title}</h2>
            <p className="text-sm text-gray-500">
              {new Date(String(healthCheck.createdAt)).toLocaleDateString()}
            </p>
            <div className="rounded bg-gray-200 px-2 text-xs capitalize">
              {healthCheck?.status}
            </div>
          </Link>
        )}
      </div>
      {healthCheck.questions?.map((item) => (
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
