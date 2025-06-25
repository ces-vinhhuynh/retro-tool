'use client';

import { Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { GenericPopover } from '@/features/health-check/components/generic-popover';
import { ActionItem } from '@/features/health-check/types/health-check';
import { formatDate } from '@/features/health-check/utils/time-format';
import { cn } from '@/utils/cn';

interface DatePopoverProps {
  item: ActionItem;
  openDatePopovers?: Record<string, boolean>;
  setOpenDatePopovers?: (value: Record<string, boolean>) => void;
  setDueDate?: (date?: Date) => void;
  isUpdating?: boolean;
  isEditable?: boolean;
}

export const DatePopover = ({
  item,
  openDatePopovers,
  setOpenDatePopovers,
  setDueDate,
  isUpdating,
  isEditable = true,
}: DatePopoverProps) => {
  const triggerButton = (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'h-8 text-xs font-normal',
        item.due_date ? 'text-cyan-500' : 'text-gray-400',
      )}
      disabled={isUpdating || !isEditable}
    >
      <Calendar size={16} className="mr-1" />
      {item.due_date ? formatDate(new Date(item.due_date)) : null}
    </Button>
  );

  const popoverContent = (
    <CalendarComponent
      mode="single"
      selected={item.due_date ? new Date(item.due_date) : undefined}
      onSelect={(date) => setDueDate?.(date)}
      initialFocus
    />
  );

  return (
    <GenericPopover
      item={item}
      openPopovers={openDatePopovers}
      setOpenPopovers={setOpenDatePopovers}
      isUpdating={isUpdating}
      triggerButton={triggerButton}
      popoverContent={popoverContent}
      align="end"
      className="w-auto p-0"
    />
  );
};

export default DatePopover;
