import { Check, Edit3, Trash2, X } from 'lucide-react';
import { useEffect, useReducer, useRef, useState } from 'react';

import { ConfirmModal } from '@/components/modal/confirm-modal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { MESSAGE } from '@/utils/messages';

import { useHandleCalendar } from '../hooks/calendar/use-handle-calendar';
import { useRemoveCalendar } from '../hooks/calendar/use-remove-calendar';
import { useCreateActionItemAssignee } from '../hooks/use-create-action-item-assignee';
import { useRemoveActionItemAssignee } from '../hooks/use-remove-action-item-assignee';
import { useUpdateActionItem } from '../hooks/use-update-action-item';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../utils/constants';

import { ActionSummaryDialog } from './sessions/action-summary-dialog';
import { UserAssignmentPopover } from './user-assignment-popover';

interface ActionItemRowProps {
  item: ActionItemWithAssignees;
  isUpdating?: boolean;
  isDeleting?: boolean;
  onDelete?: (id: string) => void;
  isHandlingOpenLink?: boolean;
  isEditable?: boolean;
  isAdmin?: boolean;
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
  isAdmin = false,
}: ActionItemRowProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] =
    useState<ActionItemWithAssignees | null>(null);

  // Edit state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [isMobileEditDialogOpen, setIsMobileEditDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

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
    // Prevent opening dialog when in edit mode or mobile edit dialog is open
    if (isEditingTitle || isMobileEditDialogOpen) return;

    setSelectedAction(action);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false);
      setSelectedAction(null);
    }
  };

  // Edit title functions
  const handleEditClick = () => {
    setEditedTitle(item.title);

    if (isMobile) {
      setIsMobileEditDialogOpen(true);
    } else {
      setIsEditingTitle(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setIsMobileEditDialogOpen(false);
    setEditedTitle(item.title);
  };

  const handleMobileDialogClose = (open: boolean) => {
    if (!open) {
      setIsMobileEditDialogOpen(false);
      setEditedTitle(item.title);
    }
  };

  // Auto-focus on edit mode for desktop
  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingTitle]);

  // Auto-focus on edit mode for mobile dialog
  useEffect(() => {
    if (isMobileEditDialogOpen && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100); // Small delay to ensure dialog is rendered
    }
  }, [isMobileEditDialogOpen]);

  const handleSaveEdit = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '' || trimmedTitle === item.title) {
      handleCancelEdit();
      return;
    }

    setIsUpdatingTitle(true);
    try {
      await updateActionItem({
        id: item.id,
        actionItem: { title: trimmedTitle },
      });
      setIsEditingTitle(false);
      setIsMobileEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update title:', error);
      setEditedTitle(item.title); // Reset on error
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Enter to save
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
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
    // Add isAdmin check to prevent deletion if user is not admin
    if (!isAdmin) {
      return;
    }

    onDelete?.(id);
    if (item.event_id) {
      await removeCalendarEvent(item.event_id);
    }
  };

  const handleDeleteClick = () => {
    // Add isAdmin check before opening confirm modal
    if (!isAdmin) {
      return;
    }
    setIsOpenModalConfirm(true);
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

  // Action Buttons Component (reusable) - Updated to conditionally show delete button
  const actionButtons = (
    <>
      <Button variant="ghost" size="sm" onClick={handleEditClick}>
        <Edit3 className="h-4 w-4" />
      </Button>
      {/* Only show delete button if user is admin */}
      {isAdmin && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </>
  );

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
                isEditable={isEditable && !isEditingTitle}
              />

              {/* Title - Editable or Display */}
              {isEditingTitle && !isMobile ? (
                // Desktop inline editing
                <div className="ml-1 flex-1">
                  <Input
                    ref={inputRef}
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-12 px-3 py-3 text-sm"
                    placeholder="Enter action title... (Enter to save, Esc to cancel)"
                    disabled={isUpdatingTitle}
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                    <span>Enter to save &bull; Esc to cancel</span>
                  </div>
                </div>
              ) : (
                // Default title display (mobile and desktop when not editing)
                <span
                  role="button"
                  tabIndex={0}
                  className={
                    item.status === ActionStatus.DONE
                      ? 'ml-1 break-words whitespace-pre-wrap text-gray-400 line-through'
                      : 'ml-1 cursor-pointer break-words whitespace-pre-wrap hover:text-blue-600'
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
              )}

              {item.description && !(isEditingTitle && !isMobile) && (
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              )}
            </div>

            {!(isEditingTitle && !isMobile) && (
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

                {/* Mobile Action Buttons - Only show on small screens (<640px) */}
                {isEditable && (
                  <div className="ml-auto flex items-center gap-1 sm:hidden">
                    {actionButtons}
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditable && (
            <div className="ml-4 hidden items-center gap-1 sm:flex">
              {isEditingTitle && !isMobile ? (
                // Desktop only: Save and Cancel buttons when editing inline
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={
                      isUpdatingTitle ||
                      editedTitle.trim() === '' ||
                      editedTitle.trim() === item.title
                    }
                    className="text-green-600 hover:bg-green-50 hover:text-green-700 disabled:text-gray-400"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isUpdatingTitle}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                // Default: Edit and Delete buttons (mobile and desktop when not editing)
                actionButtons
              )}
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

      {/* Mobile Edit Dialog */}
      <Dialog
        open={isMobileEditDialogOpen}
        onOpenChange={handleMobileDialogClose}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Action Title</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Input
                ref={mobileInputRef}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-14 px-4 py-4 text-sm"
                placeholder="Enter action title..."
                disabled={isUpdatingTitle}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isUpdatingTitle}
              className="w-full sm:w-auto sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={
                isUpdatingTitle ||
                editedTitle.trim() === '' ||
                editedTitle.trim() === item.title
              }
              className="w-full sm:w-auto sm:flex-none"
            >
              {isUpdatingTitle ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
