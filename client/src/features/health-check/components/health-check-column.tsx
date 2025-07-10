'use client';

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import { HealthCheckRatingFunction } from '../types/chart';
import { FormattedHealthCheck } from '../types/health-check';
import { formatDateTime } from '../utils/time-format';

import RatingDisplay from './rating-display';

interface HealthCheckColumnProps {
  healthCheck: FormattedHealthCheck;
  getHealthCheckRatings: HealthCheckRatingFunction;
  isShowAddNew?: boolean;
  onAddNewSession?: () => void;
  headerHeight?: string;
  columnWidth?: string;
  questionRowHeight?: string;
  titleWidth?: string;
  showMaxColumns?: boolean;
  showPreviousButton?: boolean;
  showNextButton?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  isAnyHeaderHovered?: boolean;
  onHeaderHover?: (isHovered: boolean) => void;
}

const HealthCheckColumn = ({
  healthCheck,
  getHealthCheckRatings,
  isShowAddNew = false,
  onAddNewSession,
  headerHeight = 'h-24',
  columnWidth = 'min-w-48 max-w-48',
  questionRowHeight = 'h-16',
  titleWidth = 'min-w-20 max-w-20',
  showMaxColumns = false,
  showPreviousButton = false,
  showNextButton = false,
  onPrevious,
  onNext,
  isAnyHeaderHovered = false,
  onHeaderHover,
}: HealthCheckColumnProps) => {
  const { columnClasses, titleClasses } = showMaxColumns
    ? {
        columnClasses: 'flex-1 min-w-0',
        titleClasses: 'truncate max-w-full',
      }
    : {
        columnClasses: columnWidth,
        titleClasses: cn('truncate', titleWidth),
      };

  return (
    <div
      key={healthCheck.id}
      className={cn(
        'relative flex h-full flex-col border transition-transform duration-200',
        columnClasses,
        {
          'cursor-pointer bg-blue-50': isShowAddNew,
        },
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'relative flex flex-col items-center justify-center gap-1 border-b bg-gray-50 p-2',
          headerHeight,
          {
            'border border-blue-200 bg-blue-50': isShowAddNew,
          },
        )}
        onMouseEnter={() => onHeaderHover?.(true)}
        onMouseLeave={() => onHeaderHover?.(false)}
      >
        {/* Previous Button */}
        {showPreviousButton && isAnyHeaderHovered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            className="absolute top-1/2 left-2 z-20 h-8 w-8 -translate-y-1/2 transform border border-gray-200 bg-white/95 p-0 shadow-md hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </Button>
        )}

        {/* Next Button */}
        {showNextButton && isAnyHeaderHovered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            className="absolute top-1/2 right-2 z-20 h-8 w-8 -translate-y-1/2 transform border border-gray-200 bg-white/95 p-0 shadow-md hover:bg-white"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </Button>
        )}

        {isShowAddNew ? (
          <Button
            variant={'ghost'}
            className="flex h-full w-full flex-col items-center gap-1 text-xs hover:bg-blue-50 md:gap-2 md:text-sm"
            onClick={onAddNewSession}
          >
            <Plus className="h-4 w-4 text-blue-400 md:h-6 md:w-6" />
            <span className="font-medium text-blue-400">Start New</span>
          </Button>
        ) : (
          <Link
            href={`/health-checks/${healthCheck.id}`}
            className="flex h-full w-full flex-col items-center justify-center gap-1 rounded p-1 transition-colors hover:bg-gray-100"
          >
            <h2
              className={cn(
                'text-center text-sm leading-tight font-bold md:text-base',
                titleClasses,
              )}
            >
              {healthCheck.title}
            </h2>
            <p className="max-w-full truncate text-xs text-gray-500 md:text-sm">
              {formatDateTime(new Date(String(healthCheck.createdAt)))}
            </p>
            <div className="rounded bg-gray-200 px-2 py-1 text-xs capitalize">
              {healthCheck?.status}
            </div>
          </Link>
        )}
      </div>

      {/* Ratings */}
      <div className="flex-1">
        {healthCheck.questions?.map((item) => (
          <RatingDisplay
            key={item.id}
            questionId={item.id}
            healthCheckId={healthCheck.id}
            averageScore={item.averageScore}
            getRatings={getHealthCheckRatings}
            isShowAddNew={isShowAddNew}
            height={questionRowHeight}
          />
        ))}
      </div>
    </div>
  );
};

export default HealthCheckColumn;