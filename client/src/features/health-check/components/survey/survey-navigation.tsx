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
  const canNavigate = allowParticipantNavigation || isFacilitator;

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
  
    const showRange = 1;
    const startPage = Math.max(1, index - showRange);
    const endPage = Math.min(length - 2, index + showRange);
  
    pages.push(0);
  
    if (startPage > 1) {
      pages.push('ellipsis');
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    if (endPage < length - 2) {
      pages.push('ellipsis');
    }
  
    if (length > 1) {
      pages.push(length - 1);
    }
  
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center gap-4 py-4">
      <Pagination>
        <PaginationContent>
          {canNavigate && (
            <>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 min-w-8 rounded-full"
                  onClick={() => handleNavigation(Math.max(0, index - 1))}
                  disabled={index === 0}
                >
                  ‹
                </Button>
              </PaginationItem>

              {visiblePages.map((page, idx) =>
                page === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <span className="h-8 w-8 flex items-center justify-center text-gray-400">…</span>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        `h-8 w-8 min-w-8 rounded-full border-gray-400 bg-white font-bold text-gray-400 transition hover:cursor-pointer`,
                        {
                          'pointer-events-none border-black text-black':
                            page === index,
                        },
                      )}
                      onClick={() => handleNavigation(page)}
                    >
                      {page + 1}
                    </Button>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 min-w-8 rounded-full"
                  onClick={() => handleNavigation(Math.min(length - 1, index + 1))}
                  disabled={index === length - 1}
                >
                  ›
                </Button>
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};