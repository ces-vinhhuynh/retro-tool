'use client';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
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
      <Pagination>
        <PaginationContent>
          {(allowParticipantNavigation || isFacilitator) &&
            Array.from({ length }, (_, i) => i).map((i) => (
              <PaginationItem key={i}>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    `h-8 w-8 min-w-8 rounded-full border-gray-400 bg-white font-bold text-gray-400 transition hover:cursor-pointer`,
                    {
                      'pointer-events-none border-black text-black':
                        i === index,
                    },
                  )}
                  onClick={() => handleNavigation(i)}
                >
                  {i + 1}
                </Button>
              </PaginationItem>
            ))}
        </PaginationContent>
      </Pagination>
    </div>
  );
};
