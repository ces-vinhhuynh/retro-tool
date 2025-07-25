'use client';

import { useEffect, useState } from 'react';

import {
  EXTENDED_BREAKPOINTS,
  useCurrentBreakpoint,
  useIsSmScreenSize,
} from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';

import {
  DATA_TRACK_HEALTH_CHECK_TABLE,
  HealthCheckTableResponsiveConfig,
} from '../constants/health-check-table-config';
import { HealthCheckRatingFunction } from '../types/chart';
import { FormattedHealthCheck } from '../types/health-check';

import { HealthCheckColumn } from './health-check-column';
import { QuestionRow } from './question-row';

interface HealthCheckTableViewProps {
  healthChecks: FormattedHealthCheck[];
  responsiveConfig?: HealthCheckTableResponsiveConfig;
  getHealthCheckRatings: HealthCheckRatingFunction;
  isShowAddNew?: boolean;
  onAddNewSession?: () => void;
}

export const HealthCheckTableView = ({
  healthChecks,
  responsiveConfig = DATA_TRACK_HEALTH_CHECK_TABLE,
  getHealthCheckRatings,
  isShowAddNew = false,
  onAddNewSession,
}: HealthCheckTableViewProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnyHeaderHovered, setIsAnyHeaderHovered] = useState(false);

  // Use the responsive hooks
  const currentBreakpoint = useCurrentBreakpoint(EXTENDED_BREAKPOINTS);

  type ConfigKey = keyof typeof responsiveConfig;

  const isMobile = useIsSmScreenSize(); // For navigation hint
  const currentConfig = currentBreakpoint
    ? responsiveConfig[currentBreakpoint as ConfigKey] ||
      responsiveConfig[
        Object.keys(responsiveConfig)[Object.keys(responsiveConfig).length - 1]
      ]
    : responsiveConfig['lg'];

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
      const totalColumns = healthChecks.length + (isShowAddNew ? 1 : 0);
      const actualColumnsToShow = currentConfig.columnsToShow;
      const shouldUsePagination = totalColumns > actualColumnsToShow;

      if (shouldUsePagination) {
        const totalPages = totalColumns - actualColumnsToShow + 1;
        const lastPage = totalPages - 1;
        setCurrentPage(lastPage);
      } else {
        setCurrentPage(0);
      }
    }
  }, [currentBreakpoint, currentConfig, isShowAddNew, healthChecks.length]);

  // Early return if no data
  if (!healthChecks?.length) {
    return null;
  }

  const questions = healthChecks[0]?.questions || [];

  // Logic for showing columns
  const healthCheckCount = healthChecks.length;
  const totalColumns = healthCheckCount + (isShowAddNew ? 1 : 0);
  const actualColumnsToShow = currentConfig.columnsToShow;

  const shouldUsePagination = totalColumns > actualColumnsToShow;

  let visibleHealthChecks = healthChecks;
  let totalPages = 1;
  // Will the Start New column appear on the current page?
  let canShowAddNew = false;

  if (shouldUsePagination) {
    // Sliding window pagination: each page moves by 1 column
    totalPages = totalColumns - actualColumnsToShow + 1;
    const startIndex = currentPage;
    const endIndex = startIndex + actualColumnsToShow;
    const healthCheckStartIndex = Math.min(startIndex, healthCheckCount);
    const healthCheckEndIndex = Math.min(endIndex, healthCheckCount);
    visibleHealthChecks = healthChecks.slice(
      healthCheckStartIndex,
      healthCheckEndIndex,
    );
    // Start New is displayed if the sliding window includes its position (after all health checks)
    canShowAddNew = isShowAddNew && endIndex > healthCheckCount;
  } else {
    // No pagination, then display all
    canShowAddNew = isShowAddNew;
  }

  // Determine if columns should have equal width (when reaching max columns)
  const totalVisibleColumns =
    visibleHealthChecks.length + (canShowAddNew ? 1 : 0);
  const showMaxColumns = totalVisibleColumns >= actualColumnsToShow;

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // Touch event handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
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

    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) {
        if (currentPage < totalPages - 1) {
          goToNextPage();
        }
      } else {
        if (currentPage > 0) {
          goToPreviousPage();
        }
      }
    }
  };

  const showNavigation = shouldUsePagination && totalPages > 1;

  // Calculate column range for navigation hint
  const getColumnRange = () => {
    if (!shouldUsePagination) {
      return {
        startColumn: 1,
        endColumn: healthCheckCount,
      };
    }
    const startIndex = currentPage;
    const endIndex = startIndex + actualColumnsToShow;

    // Health check columns
    const healthCheckStart = Math.min(startIndex, healthCheckCount);
    const healthCheckEnd = Math.min(endIndex, healthCheckCount);

    return {
      startColumn: healthCheckStart + 1,
      endColumn: healthCheckEnd,
    };
  };

  const { startColumn, endColumn } = getColumnRange();

  return (
    <div className="relative w-full">
      {/* Table Container */}
      <div className="flex w-full overflow-hidden rounded-lg border">
        {/* Questions Column - Responsive width */}
        <div
          className={cn(
            'flex-shrink-0 bg-gray-50',
            currentConfig.questionColumnWidthClass,
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
              width={currentConfig.questionColumnWidthClass}
            />
          ))}
        </div>

        {/* Health Check Columns Container */}
        <div className="min-w-0 flex-1">
          <div
            className={cn('flex', {
              'overflow-x-auto': !shouldUsePagination,
              'w-full': showMaxColumns, // Ensure full width when showing max number of columns
            })}
            onTouchStart={shouldUsePagination ? onTouchStart : undefined}
            onTouchMove={shouldUsePagination ? onTouchMove : undefined}
            onTouchEnd={shouldUsePagination ? onTouchEnd : undefined}
            style={{
              touchAction: shouldUsePagination ? 'pan-y' : 'auto',
            }}
          >
            {visibleHealthChecks.map((healthCheck, index) => {
              const isFirstColumn = index === 0;
              const isLastColumn = index === visibleHealthChecks.length - 1;

              const showPrev =
                showNavigation && isFirstColumn && currentPage > 0;
              // Show next on last health check column only if there are more pages and Start New is not visible in current page
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
                  titleWidth={currentConfig.titleWidth}
                  columnWidth={currentConfig.healthCheckColumnWidth}
                  showMaxColumns={showMaxColumns}
                  showPreviousButton={showPrev}
                  showNextButton={showNext}
                  onPrevious={goToPreviousPage}
                  onNext={goToNextPage}
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
                titleWidth={currentConfig.titleWidth}
                showMaxColumns={showMaxColumns}
                showPreviousButton={
                  showNavigation &&
                  visibleHealthChecks.length === 0 &&
                  currentPage > 0
                }
                showNextButton={showNavigation && currentPage < totalPages - 1}
                onPrevious={goToPreviousPage}
                onNext={goToNextPage}
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
              ? 'Swipe left/right to navigate'
              : 'Hover over column headers and click buttons to navigate'}
            &nbsp;&bull;&nbsp;Showing column number{' '}
            {startColumn === endColumn
              ? startColumn
              : `${startColumn} - ${endColumn}`}{' '}
            of {healthCheckCount} columns
          </p>
        </div>
      )}
    </div>
  );
};
