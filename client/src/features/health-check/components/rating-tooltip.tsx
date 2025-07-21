import { cn } from '@/lib/utils';

import { getScoreColors } from '../utils/color';

interface ScoreTooltipProps {
  ratings: Array<{ score: number; count: number }>;
}

export const ScoreTooltip = ({ ratings }: ScoreTooltipProps) => {
  return (
    <div className="absolute bottom-full left-1/2 w-auto -translate-x-1/2">
      <div className="flex rounded-lg border bg-white p-3 shadow-lg">
        <div className="flex gap-1">
          {ratings.map(({ score, count }) => (
            <div key={score} className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-sm font-medium text-white',
                  getScoreColors(score).circle,
                )}
              >
                {score}
              </span>
              <span className="text-xs text-gray-600">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
