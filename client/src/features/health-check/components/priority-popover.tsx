'use client';

import { CheckCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GenericPopover } from '@/features/health-check/components/generic-popover';
import {
  ActionItem,
  ActionPriority,
} from '@/features/health-check/types/health-check';
import { PRIORITY_CONFIG } from '@/features/health-check/utils/constants';
import { cn } from '@/utils/cn';

interface PriorityPopoverProps {
  item: ActionItem;
  openPriorityPopovers?: Record<string, boolean>;
  setOpenPriorityPopovers?: (value: Record<string, boolean>) => void;
  getPriorityIcon?: (priority: ActionPriority) => React.ReactNode;
  setPriority?: (id: string, priority: ActionPriority) => void;
  isUpdating?: boolean;
  isEditable?: boolean;
  variant?: 'icon' | 'text';
}

export const PriorityPopover = ({
  item,
  openPriorityPopovers,
  setOpenPriorityPopovers,
  getPriorityIcon,
  setPriority,
  isUpdating,
  isEditable = true,
  variant = 'icon',
}: PriorityPopoverProps) => {
  // Helper function to get priority color for badge variant
  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Trigger button based on variant
  const triggerButton =
    variant === 'text' ? (
      <Badge
        variant="outline"
        className={cn(
          'cursor-pointer transition-colors',
          getPriorityColor(item.priority || 'LOW'),
          !isEditable && 'hover:cursor-default',
        )}
      >
        {item.priority?.toUpperCase() || 'LOW'}
      </Badge>
    ) : (
      <Button
        variant="ghost"
        size="icon"
        disabled={!isEditable}
        className={'h-8 w-8'}
      >
        {getPriorityIcon?.(item.priority as ActionPriority)}
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
            onClick={() => setPriority?.(item.id, key as ActionPriority)}
            disabled={isUpdating || !isEditable}
          >
            <div className="flex items-center">
              <div className="flex h-4 w-4 items-center justify-center">
                {item.priority === key && <CheckCircle className="h-3 w-3" />}
              </div>
            </div>
            {variant === 'text' ? (
              <Badge
                variant="outline"
                className={cn('ml-2', getPriorityColor(key))}
              >
                {key.toUpperCase()}
              </Badge>
            ) : (
              <>
                <Icon className={cn('h-4 w-4', config.className)} />
                {config.label}
              </>
            )}
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
};
