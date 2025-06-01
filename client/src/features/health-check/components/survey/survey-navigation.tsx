'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface SurveyNavigationProps {
  allowParticipantNavigation: boolean;
  isFacilitator: boolean;
  handleNavigation: (index: number) => void;
  length: number;
  index: number;
}

export const SurveyNavigation = ({
  allowParticipantNavigation,
  isFacilitator,
  handleNavigation,
  length,
  index,
}: SurveyNavigationProps) => {
  return (
    <div className="flex justify-center gap-4 py-4">
      {allowParticipantNavigation ||
        (isFacilitator &&
          Array.from({ length }, (_, i) => i).map((i) => (
            <Button
              key={i}
              variant="outline"
              size="icon"
              disabled={i === index}
              className={cn(
                `h-8 w-8 min-w-8 rounded-full bg-white font-bold transition hover:cursor-pointer`,
              )}
              onClick={() => handleNavigation(i)}
            >
              {i + 1}
            </Button>
          )))}
    </div>
  );
};
