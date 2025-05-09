'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import DetailCard from '@/features/health-check/components/detail-card';
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
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  open: boolean;
}
export default function ChartDialog({
  onOpenChange,
  data,
  currentIndex,
  setCurrentIndex,
  open,
}: ChartDialogProps) {
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
  }, [carouselApi]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[800px]">
        <DialogTitle className="sr-only"></DialogTitle>
        <div className="h-full sm:max-w-[800px]">
          <Carousel opts={{ startIndex: currentIndex }} setApi={setCarouselApi}>
            <CarouselContent className="h-full">
              {data.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="relative flex h-[500px] w-full"
                >
                  <DetailCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

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
                  currentIndex === index && 'ring-2 ring-black',
                )}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
