'use client';

import { useEffect, useState } from 'react';

import {
  useCurrentBreakpoint,
  useIsMobileLessThan,
  useIsSmMobile,
} from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';

import { HealthCheckRatingFunction } from '../types/chart';
import { FormattedHealthCheck } from '../types/health-check';

import HealthCheckColumn from './health-check-column';
import QuestionRow from './question-row';

interface HealthCheckTableViewProps {
  healthChecks: FormattedHealthCheck[];
  getHealthCheckRatings: HealthCheckRatingFunction;
  isShowAddNew?: boolean;
  onAddNewSession?: () => void;
}

// Responsive configuration for different screen sizes
const RESPONSIVE_CONFIG = {
  xs400: {
    // < 400px
    columnsToShow: 1,
    questionColumnWidth: 'w-28',
    questionRowHeight: 'h-12',
    headerHeight: 'h-22',
  },
  xs: {
    // 400-640px
    columnsToShow: 2,
    questionColumnWidth: 'w-36',
    questionRowHeight: 'h-14',
    headerHeight: 'h-26',
  },
  sm: {
    // 640-768px
    columnsToShow: 3,
    questionColumnWidth: 'w-42',
    questionRowHeight: 'h-16',
    headerHeight: 'h-26',
  },
  md: {
    // >= 768px
    columnsToShow: 4,
    questionColumnWidth: 'w-48',
    questionRowHeight: 'h-16',
    headerHeight: 'h-26',
  },
  lg: {
    // >= 1024px
    columnsToShow: 4,
    questionColumnWidth: 'w-52',
    questionRowHeight: 'h-16',
    headerHeight: 'h-26',
  },
} as const;

const HealthCheckTableView = ({
  healthChecks,
  getHealthCheckRatings,
  isShowAddNew = false,
  onAddNewSession,
}: HealthCheckTableViewProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnyHeaderHovered, setIsAnyHeaderHovered] = useState(false);

  // Use the responsive hooks
  const breakpoint = useCurrentBreakpoint();
  const currentBreakpoint = useIsMobileLessThan(400) ? 'xs400' : breakpoint;

  const isMobile = useIsSmMobile(); // For navigation hint
  const currentConfig = currentBreakpoint
    ? RESPONSIVE_CONFIG[currentBreakpoint as keyof typeof RESPONSIVE_CONFIG]
    : RESPONSIVE_CONFIG.lg;

  // Touch/Swipe state for mobile
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null,
  );

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  // Set initial page to show latest columns (last page)
  useEffect(() => {
    if (currentBreakpoint && healthChecks.length > 0) {
      const totalColumns = healthChecks.length;
      const shouldUsePagination = totalColumns > currentConfig.columnsToShow;

      if (shouldUsePagination) {
        const totalPages = totalColumns - currentConfig.columnsToShow + 1;
        const lastPage = totalPages - 1;
        setCurrentPage(lastPage); // Start from last page to show latest data
      } else {
        setCurrentPage(0);
      }
    }
  }, [currentBreakpoint, currentConfig.columnsToShow, healthChecks.length]);

  if (!healthChecks?.length || !currentBreakpoint) {
    return null;
  }

  const questions = healthChecks[0]?.questions || [];

  // Logic for showing columns
  const totalColumns = healthChecks.length;
  const shouldUsePagination = totalColumns > currentConfig.columnsToShow;

  let visibleHealthChecks = healthChecks;
  let totalPages = 1;
  let canShowAddNew = isShowAddNew;

  if (shouldUsePagination) {
    // Sliding window pagination: each page moves by 1 column
    totalPages = totalColumns - currentConfig.columnsToShow + 1;
    const startIndex = currentPage;
    const endIndex = startIndex + currentConfig.columnsToShow;
    visibleHealthChecks = healthChecks.slice(startIndex, endIndex);
    canShowAddNew = isShowAddNew && endIndex >= totalColumns;
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // Touch event handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    // Only process horizontal swipes that meet minimum distance
    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) {
        // Swipe left (finger moves left) -> go to next page (newer data)
        if (currentPage < totalPages - 1) {
          goToNextPage();
        }
      } else {
        // Swipe right (finger moves right) -> go to previous page (older data)
        if (currentPage > 0) {
          goToPreviousPage();
        }
      }
    }
  };

  const showNavigation = shouldUsePagination && totalPages > 1;

  return (
    <div className="relative w-full">
      {/* Table Container */}
      <div className="flex w-full overflow-hidden rounded-lg border">
        {/* Questions Column - Responsive width */}
        <div
          className={cn(
            'flex-shrink-0 bg-gray-50',
            currentConfig.questionColumnWidth,
          )}
        >
          <div
            className={cn(
              'border-r border-b border-gray-200 bg-white',
              currentConfig.headerHeight,
            )}
          />
          {questions.map((question) => (
            <QuestionRow
              key={question.id}
              title={question.title}
              description={question.description}
              isShowAddNew={isShowAddNew}
              height={currentConfig.questionRowHeight}
              width={currentConfig.questionColumnWidth}
            />
          ))}
        </div>

        {/* Health Check Columns */}
        <div className="flex-1">
          <div
            className={cn('flex', {
              'overflow-x-auto': !shouldUsePagination, // Allow horizontal scroll only when not paginating
            })}
            // Touch handlers for swipe navigation on mobile
            onTouchStart={shouldUsePagination ? onTouchStart : undefined}
            onTouchMove={shouldUsePagination ? onTouchMove : undefined}
            onTouchEnd={shouldUsePagination ? onTouchEnd : undefined}
            style={{
              // Improve touch responsiveness
              touchAction: shouldUsePagination ? 'pan-y' : 'auto',
            }}
          >
            {visibleHealthChecks.map((healthCheck, index) => {
              const isFirstColumn = index === 0;
              const isLastColumn = index === visibleHealthChecks.length - 1;

              const showPrev =
                showNavigation && isFirstColumn && currentPage > 0;
              const showNext =
                showNavigation &&
                isLastColumn &&
                currentPage < totalPages - 1 &&
                !canShowAddNew;

              return (
                <HealthCheckColumn
                  key={healthCheck.id}
                  healthCheck={healthCheck}
                  getHealthCheckRatings={getHealthCheckRatings}
                  headerHeight={currentConfig.headerHeight}
                  questionRowHeight={currentConfig.questionRowHeight}
                  isFlexWidth={true}
                  // Navigation props
                  showPreviousButton={showPrev}
                  showNextButton={showNext}
                  onPrevious={goToPreviousPage}
                  onNext={goToNextPage}
                  // Shared hover state
                  isAnyHeaderHovered={isAnyHeaderHovered}
                  onHeaderHover={setIsAnyHeaderHovered}
                />
              );
            })}
            {canShowAddNew && (
              <HealthCheckColumn
                onAddNewSession={onAddNewSession}
                healthCheck={healthChecks[0]}
                getHealthCheckRatings={getHealthCheckRatings}
                isShowAddNew={isShowAddNew}
                headerHeight={currentConfig.headerHeight}
                questionRowHeight={currentConfig.questionRowHeight}
                isFlexWidth={true}
                // Show next button on Add New column when it's the last column
                showNextButton={showNavigation && currentPage < totalPages - 1}
                onNext={goToNextPage}
                // Shared hover state
                isAnyHeaderHovered={isAnyHeaderHovered}
                onHeaderHover={setIsAnyHeaderHovered}
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation hint */}
      {showNavigation && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            {isMobile
              ? 'Swipe left/right to navigate - '
              : ''}
            Showing {currentConfig.columnsToShow} of {totalColumns} columns
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthCheckTableView;
