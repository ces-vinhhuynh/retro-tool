import { Trash2, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import DatePopover from '@/features/health-check/components/date-popover';
import PriorityPopover from '@/features/health-check/components/priority-popover';
import StatusPopover from '@/features/health-check/components/status-popover';
import {
  ActionItem,
  ActionStatus,
  ActionPriority,
} from '@/features/health-check/types/health-check';

interface ActionItemRowProps {
  item: ActionItem;
  openStatusPopovers: Record<string, boolean>;
  setOpenStatusPopovers: (value: Record<string, boolean>) => void;
  openPriorityPopovers: Record<string, boolean>;
  setOpenPriorityPopovers: (value: Record<string, boolean>) => void;
  openDatePopovers: Record<string, boolean>;
  setOpenDatePopovers: (value: Record<string, boolean>) => void;
  getStatusIcon: (status: ActionStatus) => React.ReactNode;
  getPriorityIcon: (priority: ActionPriority) => React.ReactNode;
  setActionStatus: (id: string, status: ActionStatus) => void;
  setPriority: (id: string, priority: ActionPriority) => void;
  setDueDate: (id: string, date?: Date) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

export default function ActionItemRow({
  item,
  openStatusPopovers,
  setOpenStatusPopovers,
  openPriorityPopovers,
  setOpenPriorityPopovers,
  openDatePopovers,
  setOpenDatePopovers,
  getStatusIcon,
  getPriorityIcon,
  setActionStatus,
  setPriority,
  setDueDate,
  isUpdating,
  onDelete,
  isDeleting,
}: ActionItemRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2">
      <div className="flex items-center">
        <StatusPopover
          item={item}
          openStatusPopovers={openStatusPopovers}
          setOpenStatusPopovers={setOpenStatusPopovers}
          getStatusIcon={getStatusIcon}
          setActionStatus={setActionStatus}
          isUpdating={isUpdating}
        />
        <span
          className={
            item.status === ActionStatus.DONE
              ? 'ml-1 text-gray-400 line-through'
              : 'ml-1'
          }
        >
          {item.title}
        </span>
      </div>

      <div className="flex items-center">
        <PriorityPopover
          item={item}
          openPriorityPopovers={openPriorityPopovers}
          setOpenPriorityPopovers={setOpenPriorityPopovers}
          getPriorityIcon={getPriorityIcon}
          setPriority={setPriority}
          isUpdating={isUpdating}
        />

        <DatePopover
          item={item}
          openDatePopovers={openDatePopovers}
          setOpenDatePopovers={setOpenDatePopovers}
          setDueDate={setDueDate}
          isUpdating={isUpdating}
        />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-cyan-500"
        >
          <User size={18} />
          <span className="sr-only">Assign user</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete(item.id)}
          disabled={isDeleting}
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}
