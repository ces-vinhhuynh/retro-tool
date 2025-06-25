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
import DetailCard from '@/features/health-check/components/detail-card';
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
  healthCheck: HealthCheck;
  teamMembers: User[];
}

const ChartDialog = ({
  onOpenChange,
  data,
  currentIndex,
  onCurrentIndexChange,
  open,
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
          'h-auto max-h-none max-w-sm overflow-hidden rounded-lg p-0 sm:max-w-xl md:max-w-3xl',
          bg,
        )}
      >
        <DialogTitle className="sr-only"></DialogTitle>
        <Carousel opts={{ startIndex: currentIndex }} setApi={setCarouselApi}>
          <CarouselContent>
            {data.map((item, index) => (
              <CarouselItem
                key={item.id}
                className="no-scrollbar max-h-[50vh] min-h-[35vh] w-full overflow-auto"
              >
                {index === currentIndex && (
                  <DetailCard
                    healthCheck={healthCheck}
                    item={item}
                    actionItems={actionItems.filter(
                      (actionItem) => actionItem.question_id === item.id,
                    )}
                    teamMembers={teamMembers}
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex items-center justify-center gap-2.5 bg-transparent pb-3">
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
                  'size-4 cursor-pointer rounded-full px-0 py-0 transition-all duration-200 ease-in-out',
                  circle,
                  {
                    'size-[1.6rem]': currentIndex === index,
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

export default ChartDialog;