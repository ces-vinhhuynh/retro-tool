'use client';

import { useEffect, useRef, useState } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ActionItems } from '@/features/health-check/components/action-items';
import { SurveyResponses } from '@/features/health-check/components/survey-responses';
import {
  ActionItemWithAssignees,
  HealthCheck,
  User,
} from '@/features/health-check/types/health-check';
import { scoreColorMap } from '@/features/health-check/utils/color';
import { useIsSmScreenSize } from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';
import { roundAndRemoveTrailingZero } from '@/utils/number';

interface DetailCardProps {
  item: {
    id: string;
    subject: string;
    value: number;
    fullTitle: string;
    description: string;
    comments: { comment: string; created_at: string }[];
  };
  actionItems: ActionItemWithAssignees[];
  healthCheck: HealthCheck;
  teamMembers: User[];
  isFacilitator?: boolean;
  isAdmin?: boolean;
}

export const DetailCard = ({
  item,
  actionItems,
  healthCheck,
  teamMembers,
  isFacilitator = true,
  isAdmin = false,
}: DetailCardProps) => {
  const roundedValue = Math.max(0, Math.min(10, Math.round(item.value)));
  const { bg, circle } = scoreColorMap[roundedValue] || scoreColorMap[0];
  const comments = item.comments.map((comment) => comment.comment);

  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsSmScreenSize();

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement || !isMobile) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Clear previous timeout to debounce
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollTop = contentElement.scrollTop;
        const scrollHeight = contentElement.scrollHeight;
        const clientHeight = contentElement.clientHeight;

        // Only apply scroll effect if there's meaningful scrollable content
        const hasSignificantScroll = scrollHeight - clientHeight > 100;

        if (hasSignificantScroll) {
          // Use hysteresis: different thresholds for show/hide to prevent oscillation
          const showThreshold = 30;
          const hideThreshold = 60;

          if (!isScrolled && scrollTop > hideThreshold) {
            setIsScrolled(true);
          } else if (isScrolled && scrollTop < showThreshold) {
            setIsScrolled(false);
          }
        }
      }, 50); // 50ms debounce
    };

    contentElement.addEventListener('scroll', handleScroll);
    return () => {
      contentElement.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile, isScrolled]);

  return (
    <Card
      className={cn(
        'flex h-full flex-col rounded-lg border-0 px-3 shadow-none sm:px-4',
        item.value > 0 && bg,
      )}
    >
      <CardHeader className="sticky top-0 z-10 shrink-0 bg-inherit px-2 pt-2 pb-2 sm:p-6 sm:px-6">
        {item.value > 0 ? (
          <div className="flex items-start gap-2 md:gap-5">
            <div
              className={cn(
                'flex shrink-0 items-center justify-center rounded-full',
                'h-12 w-12 sm:mt-1 sm:h-16 sm:w-16',
                circle,
              )}
            >
              <span className="text-lg font-bold text-white sm:text-3xl">
                {roundAndRemoveTrailingZero(item.value)}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-0.5">
              <div className="text-lg font-semibold text-gray-900 sm:text-xl sm:font-bold">
                {item.subject}
              </div>
              <div
                className={cn(
                  'text-sm text-gray-600 transition-all duration-300 sm:text-base',
                  // On mobile: hide or truncate when scrolling.
                  isMobile && isScrolled ? 'line-clamp-1 opacity-60' : '',
                )}
              >
                {item.description}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            <div className="text-lg font-semibold text-gray-900 sm:text-xl sm:font-bold">
              {item.subject}
            </div>
            <div
              className={cn(
                'text-sm text-gray-600 transition-all duration-300 sm:text-base',
                // On mobile: hide or truncate when scrolling.
                isMobile && isScrolled ? 'line-clamp-1 opacity-60' : '',
              )}
            >
              {item.description}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent
        ref={contentRef}
        className="ml-2 w-full flex-1 overflow-y-auto border-t px-1 py-2 sm:px-6 sm:py-5"
      >
        <ActionItems
          actionItems={actionItems}
          questionId={item.id}
          healthCheckId={healthCheck.id}
          teamId={String(healthCheck.team_id)}
          teamMembers={teamMembers}
          isEditable={isFacilitator}
          isAdmin={isAdmin}
        />
        <SurveyResponses
          comments={comments}
          teamId={String(healthCheck.team_id)}
          healthCheckId={healthCheck.id}
        />
      </CardContent>
    </Card>
  );
};
