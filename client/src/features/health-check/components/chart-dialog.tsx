'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DetailCard } from '@/features/health-check/components/detail-card';
import {
  ActionItemWithAssignees,
  HealthCheck,
  User,
} from '@/features/health-check/types/health-check';
import { scoreColorMap } from '@/features/health-check/utils/color';
import { cn } from '@/utils/cn';

interface ChartDialogProps {
  onOpenChange: (open: boolean) => void;
  data: {
    id: string;
    subject: string;
    value: number;
    fullTitle: string;
    description: string;
    comments: { comment: string; created_at: string }[];
  }[];
  actionItems: ActionItemWithAssignees[];
  currentIndex: number;
  onCurrentIndexChange: (index: number) => void;
  open: boolean;
  isFacilitator?: boolean;
  isAdmin?: boolean;
  healthCheck: HealthCheck;
  teamMembers: User[];
}

export const ChartDialog = ({
  onOpenChange,
  data,
  currentIndex,
  onCurrentIndexChange,
  open,
  isFacilitator = true,
  isAdmin = false,
  actionItems,
  healthCheck,
  teamMembers,
}: ChartDialogProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const scrollToIndex = (index: number) => {
    // Update index and URL when user manually clicks button
    onCurrentIndexChange(index); // Update URL param
    // Then scroll to that index
    carouselApi?.scrollTo(index);
  };

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => {
      const newIndex = carouselApi.selectedScrollSnap();
      // Only update if different from current to avoid loops
      if (newIndex !== currentIndex) {
        onCurrentIndexChange(newIndex); // Update URL param when carousel changes
      }
    };

    carouselApi.on('select', handleSelect);

    return () => {
      carouselApi.off('select', handleSelect);
    };
  }, [carouselApi, currentIndex, onCurrentIndexChange]);

  const roundedValue = Math.max(
    0,
    Math.min(10, Math.round(data[currentIndex].value)),
  );
  const { bg } = scoreColorMap[roundedValue] || scoreColorMap[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'h-auto max-h-none overflow-hidden rounded-lg',
          // Mobile: full width with minimal padding, Desktop: constrained width
          'w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] p-0',
          'sm:w-auto sm:max-w-xl md:max-w-3xl',
          bg,
        )}
      >
        <DialogTitle className="sr-only"></DialogTitle>
        <Carousel opts={{ startIndex: currentIndex }} setApi={setCarouselApi}>
          <CarouselContent>
            {data.map((item, index) => (
              <CarouselItem
                key={item.id}
                className="no-scrollbar max-h-[50vh] min-h-[35vh] w-full overflow-auto pl-0"
              >
                {index === currentIndex && (
                  <DetailCard
                    healthCheck={healthCheck}
                    item={item}
                    actionItems={actionItems.filter(
                      (actionItem) => actionItem.question_id === item.id,
                    )}
                    teamMembers={teamMembers}
                    isFacilitator={isFacilitator}
                    isAdmin={isAdmin}
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex items-center justify-center gap-2.5 bg-transparent px-2 pb-3">
          {data.map((item, index) => {
            const roundedValue = Math.max(
              0,
              Math.min(10, Math.round(item.value)),
            );
            const { circle } = scoreColorMap[roundedValue] || scoreColorMap[0];
            return (
              <Button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  'cursor-pointer rounded-full px-0 py-0 transition-all duration-200 ease-in-out',
                  'size-3 sm:size-4',
                  circle,
                  {
                    'size-5 sm:size-[1.6rem]': currentIndex === index,
                  },
                )}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
