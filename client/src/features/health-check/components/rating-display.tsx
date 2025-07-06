import { useState } from 'react';

import { cn } from '@/utils/cn';

import { getScoreColors } from '../utils/color';

import ScoreTooltip from './rating-tooltip';

type Rating = {
  score: number;
  count: number;
};

interface RatingDisplayProps {
  questionId: string;
  healthCheckId: string;
  averageScore: number;
  getRatings: (healthCheckId: string, questionId: string) => Rating[];
  isShowAddNew?: boolean;
  height?: string;
}

const RatingDisplay = ({
  questionId,
  healthCheckId,
  averageScore,
  getRatings,
  isShowAddNew = false,
  height = 'h-16',
}: RatingDisplayProps) => {
  const [hovered, setHovered] = useState(false);
  const { bg } = getScoreColors(averageScore);
  const ratings = getRatings(healthCheckId, questionId);
  const hasScore = averageScore > 0;

  return (
    <div
      className={cn(
        'relative flex h-16 items-center justify-center border-gray-200',
        bg,
        height,
        { 'bg-blue-50': isShowAddNew },
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isShowAddNew && (
        <>
          <span
            className={cn('text-xl font-bold', !hasScore && 'text-gray-400')}
          >
            {hasScore ? averageScore.toFixed(1) : '-'}
          </span>

          {hovered &&
            (ratings.length > 0 ? (
              <ScoreTooltip ratings={ratings} />
            ) : (
              <div className="absolute bottom-full left-1/2 w-auto -translate-x-1/2">
                <div className="flex rounded-lg border bg-white p-3 shadow-lg">
                  <span className="text-sm text-gray-600">No ratings yet</span>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default RatingDisplay;
