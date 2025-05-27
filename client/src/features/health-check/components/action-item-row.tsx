import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DatePopover } from '@/features/health-check/components/date-popover';
import { PriorityPopover } from '@/features/health-check/components/priority-popover';
import { StatusPopover } from '@/features/health-check/components/status-popover';
import {
  ActionItemWithAssignees,
  ActionPriority,
  ActionStatus,
  User,
} from '@/features/health-check/types/health-check';

import { useActionItemAssignSubscription } from '../hooks/use-action-item-assign-subcription';
import { useCreateActionItemAssignee } from '../hooks/use-create-action-item-assignee';
import { useRemoveActionItemAssignee } from '../hooks/use-remove-action-item-assignee';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../utils/constants';

import UserAssignmentPopover from './user-assignment-popover';

interface ActionItemRowProps {
  item: ActionItemWithAssignees;
  openStatusPopovers?: Record<string, boolean>;
  setOpenStatusPopovers?: (value: Record<string, boolean>) => void;
  openPriorityPopovers?: Record<string, boolean>;
  setOpenPriorityPopovers?: (value: Record<string, boolean>) => void;
  openDatePopovers?: Record<string, boolean>;
  setOpenDatePopovers?: (value: Record<string, boolean>) => void;
  setActionStatus?: (id: string, status: ActionStatus) => void;
  setPriority?: (id: string, priority: ActionPriority) => void;
  setDueDate?: (id: string, date?: Date) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  onDelete?: (id: string) => void;
  isEditable?: boolean;
  teamMembers: User[];
  openAssigneePopovers?: Record<string, boolean>;
  setOpenAssigneePopovers?: (value: Record<string, boolean>) => void;
}

export const ActionItemRow = ({
  item,
  openStatusPopovers,
  setOpenStatusPopovers,
  openPriorityPopovers,
  setOpenPriorityPopovers,
  openDatePopovers,
  setOpenDatePopovers,
  setActionStatus,
  setPriority,
  setDueDate,
  isUpdating,
  onDelete,
  isDeleting,
  teamMembers,
  openAssigneePopovers,
  setOpenAssigneePopovers,
  isEditable = true,
}: ActionItemRowProps) => {
  useActionItemAssignSubscription(item.id);
  const { mutate: createActionItemAssignee, isPending: isCreatingAssignee } =
    useCreateActionItemAssignee();

  const { mutate: removeActionItemAssignee, isPending: isRemovingAssignee } =
    useRemoveActionItemAssignee();

  const getStatusIcon = (status: ActionStatus) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    if (!config) return null;
    const Icon = config.icon;
    return <Icon className={config.className} size={20} />;
  };

  const getPriorityIcon = (priority: ActionPriority) => {
    const config = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG];
    if (!config) return null;
    const Icon = config.icon;
    return <Icon className={config.className} size={20} />;
  };

  const getAssignees = (item: ActionItemWithAssignees) => {
    return (
      item?.action_item_assignees
        ?.map((assignee) => assignee.team_user_id)
        .filter((id): id is string => id !== null) ?? []
    );
  };

  const assignToAll = (id: string) => {
    const currentAssignees = new Set(
      item.action_item_assignees.map((a) => a.team_user_id),
    );
    const newAssignees = teamMembers
      .map((m) => m.id)
      .filter((id) => !currentAssignees.has(id));

    if (newAssignees.length) {
      createActionItemAssignee({ actionItemId: id, teamUserIds: newAssignees });
    }
  };

  const assignToNone = (id: string) => {
    removeActionItemAssignee({
      actionItemId: id,
      teamUserIds: teamMembers.map((member) => member.id),
    });
  };

  const toggleAssignee = (id: string, memberId: string) => {
    const isAssigned = item.action_item_assignees.some(
      (a) => a.team_user_id === memberId,
    );

    const payload = { actionItemId: id, teamUserIds: [memberId] };

    if (isAssigned) {
      removeActionItemAssignee(payload);
    } else {
      createActionItemAssignee(payload);
    }
  };

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
          isEditable={isEditable}
          openPriorityPopovers={openPriorityPopovers}
          setOpenPriorityPopovers={setOpenPriorityPopovers}
          getPriorityIcon={getPriorityIcon}
          setPriority={setPriority}
          isUpdating={isUpdating}
        />

        <DatePopover
          item={item}
          isEditable={isEditable}
          openDatePopovers={openDatePopovers}
          setOpenDatePopovers={setOpenDatePopovers}
          setDueDate={setDueDate}
          isUpdating={isUpdating}
        />

        <UserAssignmentPopover
          item={item}
          teamMembers={teamMembers}
          isEditable={isEditable}
          assignees={getAssignees(item)}
          openPopovers={openAssigneePopovers}
          setOpenPopovers={setOpenAssigneePopovers}
          assignToNone={assignToNone}
          assignToAll={assignToAll}
          toggleAssignee={toggleAssignee}
          isCreatingAssignee={isCreatingAssignee}
          isRemovingAssignee={isRemovingAssignee}
        />

        {isEditable && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete?.(item.id)}
            disabled={isDeleting}
          >
            <Trash2 size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActionItemRow;
