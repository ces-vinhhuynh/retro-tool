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
  setCurrentIndex: (index: number) => void;
  open: boolean;
  healthCheck: HealthCheck;
  teamMembers: User[];
}

const ChartDialog = ({
  onOpenChange,
  data,
  currentIndex,
  setCurrentIndex,
  open,
  actionItems,
  healthCheck,
  teamMembers,
}: ChartDialogProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  useEffect(() => {
    if (!carouselApi) return;

    setCurrentIndex(carouselApi.selectedScrollSnap());

    carouselApi.on('select', () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    });

    return () => {
      carouselApi.off('select', () => {
        setCurrentIndex(carouselApi.selectedScrollSnap());
      });
    };
  }, [carouselApi, setCurrentIndex]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-h-none w-full overflow-hidden p-0 sm:max-w-[800px]">
        <DialogTitle className="sr-only"></DialogTitle>
        <Carousel opts={{ startIndex: currentIndex }} setApi={setCarouselApi}>
          <CarouselContent>
            {data.map((item, index) => (
              <CarouselItem
                key={item.id}
                className="no-scrollbar relative flex min-h-[57vh] w-full overflow-auto"
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

        <div className="absolute right-0 bottom-4 left-0 z-20 flex justify-center space-x-2">
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
                  'h-3 w-3 cursor-pointer rounded-full px-0 py-0',
                  circle,
                  {
                    'ring-2 ring-black': currentIndex === index,
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
