'use client';

import { ReactNode } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ActionItem } from '@/features/health-check/types/health-check';

interface GenericPopoverProps {
  item: ActionItem;
  openPopovers: Record<string, boolean>;
  setOpenPopovers: (value: Record<string, boolean>) => void;
  isUpdating: boolean;
  triggerButton: ReactNode;
  popoverContent: ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export default function GenericPopover({
  item,
  openPopovers,
  setOpenPopovers,
  isUpdating: _isUpdating,
  triggerButton,
  popoverContent,
  align = 'end',
  className = 'w-auto p-0',
}: GenericPopoverProps) {
  return (
    <Popover
      open={openPopovers[item.id] ?? false}
      onOpenChange={(open) =>
        setOpenPopovers({
          ...openPopovers,
          [item.id]: open,
        })
      }
    >
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className={className} align={align}>
        {popoverContent}
      </PopoverContent>
    </Popover>
  );
}
