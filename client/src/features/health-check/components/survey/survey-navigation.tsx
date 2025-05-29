'use client';

import { Button } from '@/components/ui/button';

interface SurveyNavigationProps {
  allowParticipantNavigation: boolean;
  isFacilitator: boolean;
  handleNavigation: (direction: 'next' | 'previous') => void;
  isFirst: boolean;
  isLast: boolean;
}

export const SurveyNavigation = ({
  allowParticipantNavigation,
  isFacilitator,
  handleNavigation,
  isFirst,
  isLast,
}: SurveyNavigationProps) => {
  return (
    <div className="flex justify-between gap-4 py-4">
      {!isFirst && (
        <Button
          onClick={() => handleNavigation('previous')}
          disabled={(!allowParticipantNavigation && !isFacilitator) || isFirst}
          className="bg-ces-orange-500 hover:bg-ces-orange-600 w-full text-white disabled:opacity-50 sm:w-auto"
        >
          Previous
        </Button>
      )}
      {!isLast && (
        <Button
          onClick={() => handleNavigation('next')}
          disabled={!allowParticipantNavigation && !isFacilitator}
          className="bg-ces-orange-500 hover:bg-ces-orange-600 ml-auto w-full text-white disabled:opacity-50 sm:w-auto"
        >
          Next
        </Button>
      )}
    </div>
  );
};
