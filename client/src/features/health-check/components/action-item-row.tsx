import { Edit3, Trash2 } from 'lucide-react';
import { useReducer, useState } from 'react';

import ConfirmModal from '@/components/modal/confirm-modal';
import { Button } from '@/components/ui/button';
import { DatePopover } from '@/features/health-check/components/date-popover';
import { PriorityPopover } from '@/features/health-check/components/priority-popover';
import { StatusPopover } from '@/features/health-check/components/status-popover';
import {
  ActionItemWithAssignees,
  ActionPriority,
  ActionStatus,
  HealthCheck,
  User,
} from '@/features/health-check/types/health-check';
import { MESSAGE } from '@/utils/messages';

import { useHandleCalendar } from '../hooks/calendar/use-handle-calendar';
import { useRemoveCalendar } from '../hooks/calendar/use-remove-calendar';
import { useCreateActionItemAssignee } from '../hooks/use-create-action-item-assignee';
import { useRemoveActionItemAssignee } from '../hooks/use-remove-action-item-assignee';
import { useUpdateActionItem } from '../hooks/use-update-action-item';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../utils/constants';

import ActionSummaryDialog from './sessions/action-summary-dialog';
import UserAssignmentPopover from './user-assignment-popover';

interface ActionItemRowProps {
  item: ActionItemWithAssignees;
  isUpdating?: boolean;
  isDeleting?: boolean;
  onDelete?: (id: string) => void;
  isHandlingOpenLink?: boolean;
  isEditable?: boolean;
  teamMembers: User[];
  healthChecks?: HealthCheck[];
}

interface PopoverState {
  openStatusPopovers: Record<string, boolean>;
  openPriorityPopovers: Record<string, boolean>;
  openDatePopovers: Record<string, boolean>;
  openAssigneePopovers: Record<string, boolean>;
}

const initialState: PopoverState = {
  openStatusPopovers: {},
  openPriorityPopovers: {},
  openDatePopovers: {},
  openAssigneePopovers: {},
};

function reducer(
  state: PopoverState,
  action: { type: string; payload: Record<string, boolean> },
) {
  switch (action.type) {
    case 'SET_OPEN_STATUS_POPOVERS':
      return { ...state, openStatusPopovers: action.payload };
    case 'SET_OPEN_PRIORITY_POPOVERS':
      return { ...state, openPriorityPopovers: action.payload };
    case 'SET_OPEN_DATE_POPOVERS':
      return { ...state, openDatePopovers: action.payload };
    case 'SET_OPEN_ASSIGNEE_POPOVERS':
      return { ...state, openAssigneePopovers: action.payload };
    default:
      return state;
  }
}

export const ActionItemRow = ({
  item,
  isUpdating,
  onDelete,
  isHandlingOpenLink,
  isDeleting,
  teamMembers,
  healthChecks,
  isEditable = true,
}: ActionItemRowProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] =
    useState<ActionItemWithAssignees | null>(null);

  const allEmails = teamMembers.flatMap((member) =>
    member.email ? [member.email] : [],
  );

  const assignedEmails = item.action_item_assignees.flatMap((assignee) =>
    assignee.team_users?.users?.email ? [assignee.team_users.users.email] : [],
  );

  const { mutate: createActionItemAssignee, isPending: isCreatingAssignee } =
    useCreateActionItemAssignee();
  const { mutate: removeActionItemAssignee, isPending: isRemovingAssignee } =
    useRemoveActionItemAssignee();
  const { mutateAsync: removeCalendarEvent } = useRemoveCalendar();
  const { mutateAsync: handleCalendar } = useHandleCalendar();
  const { mutateAsync: updateActionItem } = useUpdateActionItem();

  const handleActionItemClick = (action: ActionItemWithAssignees) => {
    setSelectedAction(action);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false);
      setSelectedAction(null);
    }
  };

  const updateCalendar = (emails: string[]) => {
    if (!item.event_id) return;
    handleCalendar({
      title: item.title,
      eventId: item.event_id,
      emails,
      description: item.description ?? '',
      dueDate: item.due_date ?? '',
    });
  };

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
      .filter((memberId) => !currentAssignees.has(memberId));

    if (newAssignees.length > 0) {
      createActionItemAssignee({ actionItemId: id, teamUserIds: newAssignees });
    }

    updateCalendar(allEmails);
  };

  const assignToNone = (id: string) => {
    removeActionItemAssignee({
      actionItemId: id,
      teamUserIds: teamMembers.map((m) => m.id),
    });

    updateCalendar([]);
  };

  const toggleAssignee = ({
    id,
    memberId,
    email,
  }: {
    id: string;
    memberId: string;
    email: string;
  }) => {
    const isAssigned = item.action_item_assignees.some(
      (a) => a.team_user_id === memberId,
    );
    const payload = { actionItemId: id, teamUserIds: [memberId] };

    if (isAssigned) {
      removeActionItemAssignee(payload);
      if (item.event_id) {
        handleCalendar({
          title: item.title,
          eventId: item.event_id,
          emails: assignedEmails.filter((e) => e !== email),
          dueDate: item.due_date ?? '',
        });
      }
    } else {
      createActionItemAssignee(payload);
      if (item.event_id) {
        handleCalendar({
          title: item.title,
          eventId: item.event_id,
          emails: [...assignedEmails, email],
          dueDate: item.due_date ?? '',
        });
      }
    }
  };

  const setActionStatus = async (id: string, status: ActionStatus) => {
    dispatch({
      type: 'SET_OPEN_STATUS_POPOVERS',
      payload: { ...state.openStatusPopovers, [id]: false },
    });
    updateActionItem({
      id,
      actionItem: {
        status,
        ...(status === ActionStatus.DONE && { event_id: null }),
      },
    });

    if (item.event_id && status === ActionStatus.DONE) {
      await removeCalendarEvent(item.event_id);
    }

    if (
      item.event_id === null &&
      status !== ActionStatus.DONE &&
      item.due_date !== null
    ) {
      const eventId = await handleCalendar({
        title: item.title,
        eventId: item.event_id,
        emails: assignedEmails,
        dueDate: item.due_date ?? '',
      });
      await updateActionItem({
        id,
        actionItem: {
          event_id: eventId,
        },
      });
    }
  };

  const setDueDate = async (date?: Date) => {
    if (!date) return;

    const due_date = date.toLocaleDateString('en-CA');

    const eventId = await handleCalendar({
      title: item.title,
      eventId: item.event_id,
      emails: assignedEmails,
      description: item.description ?? '',
      dueDate: due_date,
    });

    await updateActionItem({
      id: item.id,
      actionItem: { due_date, event_id: String(eventId) },
    });

    dispatch({
      type: 'SET_OPEN_DATE_POPOVERS',
      payload: { ...state.openDatePopovers, [item.id]: false },
    });
  };

  const setPriority = (id: string, priority: ActionPriority) => {
    dispatch({
      type: 'SET_OPEN_PRIORITY_POPOVERS',
      payload: { ...state.openPriorityPopovers, [id]: false },
    });
    updateActionItem({ id, actionItem: { priority } });
  };

  const handleDeleteActionItem = async (id: string) => {
    onDelete?.(id);
    if (item.event_id) {
      await removeCalendarEvent(item.event_id);
    }
  };

  const findHealthCheckById = (
    healthCheckId?: string | null,
  ): HealthCheck | undefined => {
    if (!healthCheckId || !healthChecks || healthChecks.length === 0) {
      return undefined;
    }
    return healthChecks.find(
      (healthCheck) => healthCheck?.id === healthCheckId,
    );
  };

  return (
    <>
      <div className="mb-2 space-y-3 rounded-lg border pr-2 pl-2 sm:mb-3 md:p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center">
              <StatusPopover
                item={item}
                openStatusPopovers={state.openStatusPopovers}
                setOpenStatusPopovers={(payload) =>
                  dispatch({ type: 'SET_OPEN_STATUS_POPOVERS', payload })
                }
                getStatusIcon={getStatusIcon}
                setActionStatus={setActionStatus}
                isUpdating={isUpdating}
                isEditable={isEditable}
              />
              <span
                role="button"
                tabIndex={0}
                className={
                  item.status === ActionStatus.DONE
                    ? 'ml-1 text-gray-400 line-through'
                    : 'ml-1 cursor-pointer hover:text-blue-600'
                }
                onClick={() => handleActionItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleActionItemClick(item);
                  }
                }}
              >
                {item.title}
              </span>
              {item.description && (
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-4">
              {/* Priority Badge using PriorityPopover with badge variant */}
              <PriorityPopover
                item={item}
                variant="text"
                isEditable={isEditable}
                openPriorityPopovers={state.openPriorityPopovers}
                setOpenPriorityPopovers={(payload) =>
                  dispatch({ type: 'SET_OPEN_PRIORITY_POPOVERS', payload })
                }
                setPriority={setPriority}
                getPriorityIcon={getPriorityIcon}
                isUpdating={isUpdating}
              />

              {/* Assigned Users using UserAssignmentPopover with text variant */}
              <UserAssignmentPopover
                item={item}
                teamMembers={teamMembers}
                isEditable={isEditable}
                assignees={getAssignees(item)}
                variant="avatars"
                showLabel={true}
                openPopovers={state.openAssigneePopovers}
                setOpenPopovers={(payload) =>
                  dispatch({ type: 'SET_OPEN_ASSIGNEE_POPOVERS', payload })
                }
                assignToNone={assignToNone}
                assignToAll={assignToAll}
                toggleAssignee={toggleAssignee}
                isCreatingAssignee={isCreatingAssignee}
                isRemovingAssignee={isRemovingAssignee}
              />

              {/* Date using DatePopover with text variant */}
              <DatePopover
                item={item}
                variant="text"
                isEditable={isEditable}
                openDatePopovers={state.openDatePopovers}
                setOpenDatePopovers={(payload) =>
                  dispatch({ type: 'SET_OPEN_DATE_POPOVERS', payload })
                }
                setDueDate={setDueDate}
                isUpdating={isUpdating}
              />

              {/* Health Check Title - responsive text size */}
              <span className="h-auto p-1 text-sm font-normal">
                {findHealthCheckById(item.health_check_id)?.title || ''}
              </span>
            </div>
          </div>
          {isEditable && (
            <div className="ml-4 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleActionItemClick(item)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpenModalConfirm(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        variant="delete"
        isOpen={isOpenModalConfirm}
        title={MESSAGE.DELETE_ACTION_ITEM_TITLE}
        description={MESSAGE.DELETE_ACTION_ITEM_DESCRIPTION}
        onCancel={() => setIsOpenModalConfirm(false)}
        onConfirm={() => handleDeleteActionItem(item.id)}
        loading={isDeleting}
      />

      <ActionSummaryDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        action={selectedAction}
        isHandlingNavigate={isHandlingOpenLink || false}
        teamMembers={teamMembers.map((member) => ({
          id: member.id,
          full_name: member.full_name,
          email: member.email,
          avatar_url: member.avatar_url,
          created_at: null,
          updated_at: null,
        }))}
      />
    </>
  );
};

export default ActionItemRow;
