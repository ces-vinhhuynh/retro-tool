'use client';

import { cn } from '@/utils/cn';

interface ScoreMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  colorClass?: string;
}

export const ScoreMetric = ({
  label,
  value,
  unit = '/10',
  colorClass = 'text-primary',
}: ScoreMetricProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border bg-gray-50 px-3 py-2 sm:flex-row',
      )}
    >
      <span className="text-[15px] font-medium text-gray-500">{label}:</span>
      <div>
        <span className={cn('text-md font-bold', colorClass)}>{value}</span>
        {unit && <span className="text-gray-500">{unit}</span>}
      </div>
    </div>
  );
};
