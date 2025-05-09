'use client';

import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import GenericPopover from '@/features/health-check/components/generic-popover';
import {
  ActionItem,
  ActionPriority,
} from '@/features/health-check/types/health-check';
import { PRIORITY_CONFIG } from '@/features/health-check/utils/constants';
import { cn } from '@/utils/cn';

interface PriorityPopoverProps {
  item: ActionItem;
  openPriorityPopovers: Record<string, boolean>;
  setOpenPriorityPopovers: (value: Record<string, boolean>) => void;
  getPriorityIcon: (priority: ActionPriority) => React.ReactNode;
  setPriority: (id: string, priority: ActionPriority) => void;
  isUpdating: boolean;
}

export default function PriorityPopover({
  item,
  openPriorityPopovers,
  setOpenPriorityPopovers,
  getPriorityIcon,
  setPriority,
  isUpdating,
}: PriorityPopoverProps) {
  const triggerButton = (
    <Button variant="ghost" size="icon" className="h-8 w-8">
      {getPriorityIcon(item.priority as ActionPriority)}
    </Button>
  );

  const popoverContent = (
    <div className="space-y-2">
      <p className="mb-2 text-xs font-medium">PRIORITY</p>
      {Object.entries(PRIORITY_CONFIG).map(([key, config]) => {
        const Icon = config.icon;
        return (
          <Button
            key={key}
            variant="ghost"
            className="h-8 w-full justify-start rounded-none px-2 font-normal"
            onClick={() => setPriority(item.id, key as ActionPriority)}
            disabled={isUpdating}
          >
            <div className="flex items-center">
              <div className="flex h-4 w-4 items-center justify-center">
                {item.priority === key && <CheckCircle className="h-3 w-3" />}
              </div>
            </div>
            <Icon className={cn('h-4 w-4', config.className)} />
            {config.label}
          </Button>
        );
      })}
    </div>
  );

  return (
    <GenericPopover
      item={item}
      openPopovers={openPriorityPopovers}
      setOpenPopovers={setOpenPriorityPopovers}
      isUpdating={isUpdating}
      triggerButton={triggerButton}
      popoverContent={popoverContent}
      align="end"
      className="w-35 p-2"
    />
  );
}
