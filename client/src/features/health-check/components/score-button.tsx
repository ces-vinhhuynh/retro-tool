'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { getScoreColor } from '../utils/color';

interface ScoreButtonProps {
  score: number;
  value: number;
  maxScore: number;
  disabled: boolean;
  onValueChange: (score: number) => void;
}

export const ScoreButton = ({
  score,
  value,
  maxScore,
  disabled,
  onValueChange,
}: ScoreButtonProps) => {
  const buttonColor = getScoreColor({
    scoreSelected: value,
    score,
    maxScore,
  });

  return (
    <Button
      variant="default"
      size="icon"
      className={cn(
        `h-8 w-8 rounded-full font-bold text-white transition hover:cursor-pointer`,
        value === score && 'scale-110',
        buttonColor,
      )}
      disabled={disabled}
      onClick={() => onValueChange(score)}
    >
      {score}
    </Button>
  );
};
