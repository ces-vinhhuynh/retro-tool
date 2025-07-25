'use client';

import { Button } from '@/components/ui/button';
import { GenericPopover } from '@/features/health-check/components/generic-popover';
import {
  ActionItem,
  ActionStatus,
} from '@/features/health-check/types/health-check';
import { STATUS_CONFIG } from '@/features/health-check/utils/constants';
import { cn } from '@/utils/cn';

interface StatusPopoverProps {
  item: ActionItem;
  openStatusPopovers?: Record<string, boolean>;
  setOpenStatusPopovers?: (value: Record<string, boolean>) => void;
  getStatusIcon?: (status: ActionStatus) => React.ReactNode;
  setActionStatus?: (id: string, status: ActionStatus) => void;
  isUpdating?: boolean;
  isEditable?: boolean;
}

export const StatusPopover = ({
  item,
  openStatusPopovers,
  setOpenStatusPopovers,
  getStatusIcon,
  setActionStatus,
  isUpdating,
  isEditable = true,
}: StatusPopoverProps) => {
  const triggerButton = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'h-8 min-w-8 p-0',
        !isEditable && 'cursor-default hover:bg-transparent',
      )}
    >
      {getStatusIcon?.(item.status as ActionStatus)}
    </Button>
  );

  const popoverContent = (
    <div className="flex flex-col px-2 py-2">
      {Object.entries(STATUS_CONFIG).map(([key, config]) => {
        const Icon = config.icon;
        return (
          <Button
            key={key}
            variant="ghost"
            className="h-8 justify-start rounded-none px-2 font-normal"
            onClick={() => setActionStatus?.(item.id, key as ActionStatus)}
            disabled={!isEditable || isUpdating}
          >
            <Icon className={cn('mr-2 h-4 w-4', config.className)} />
            {config.label}
          </Button>
        );
      })}
    </div>
  );

  return (
    <GenericPopover
      item={item}
      openPopovers={openStatusPopovers}
      setOpenPopovers={setOpenStatusPopovers}
      isUpdating={isUpdating}
      triggerButton={triggerButton}
      popoverContent={popoverContent}
      align="start"
      className="w-40 p-0"
    />
  );
};
