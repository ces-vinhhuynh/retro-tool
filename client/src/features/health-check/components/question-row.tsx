'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useIsMdScreenSize } from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';

interface QuestionRowProps {
  title: string;
  description: string;
  isShowAddNew?: boolean;
  height?: string;
  width?: string;
}

export const QuestionRow = ({
  title,
  description,
  height = 'h-16',
  width = 'w-32 md:w-56 lg:w-68',
}: QuestionRowProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Detect screen size
  const isMobile = useIsMdScreenSize();

  const handleInfoClick = () => {
    if (isMobile) {
      setIsPopoverOpen(true);
    }
  };

  const InfoButton = (
    <button
      className="ml-1 shrink-0 transition-colors hover:text-gray-600"
      title={!isMobile ? description : undefined} // Only show browser tooltip on desktop
      onClick={handleInfoClick}
    >
      <Info size={14} className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
    </button>
  );

  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-1 border-r border-b border-gray-200 p-2',
        height,
        width,
      )}
    >
      <div className="flex w-full min-w-0 items-center justify-between">
        <span className="truncate text-xs font-medium sm:text-sm">{title}</span>

        {isMobile ? (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>{InfoButton}</PopoverTrigger>
            <PopoverContent
              className="w-[calc(100vw-2rem)] max-w-sm p-3 text-sm"
              side="top"
              align="end"
              sideOffset={5}
              avoidCollisions={true}
              collisionPadding={16}
            >
              <div className="space-y-2">
                <h4 className="font-medium">{title}</h4>
                <p className="leading-relaxed text-gray-600">{description}</p>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          InfoButton
        )}
      </div>
    </div>
  );
};
