'use client';

import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ActionItemRow } from '@/features/health-check/components/action-item-row';
import { useCreateActionItem } from '@/features/health-check/hooks/use-create-action-item';
import { useDeleteActionItem } from '@/features/health-check/hooks/use-delete-action-item';
import { useUpdateActionItem } from '@/features/health-check/hooks/use-update-action-item';
import {
  ActionItem,
  ActionItemWithAssignees,
  ActionPriority,
  ActionStatus,
  User,
} from '@/features/health-check/types/health-check';

import { useActionItemAssignSubscription } from '../hooks/use-action-item-assign-subscription';
import { useActionItemsByTeamsSubscription } from '../hooks/use-action-items-by-teams-subscriptions';

import EntryForm from './entry-form';

interface ActionItemsProps {
  actionItems: ActionItemWithAssignees[];
  teamId?: string;
  healthCheckId?: string;
  questionId?: string;
  teamMembers: User[];
}

const updateItemState = (
  id: string,
  updates: Partial<ActionItemWithAssignees>,
  setItems: React.Dispatch<React.SetStateAction<ActionItemWithAssignees[]>>,
  items: ActionItemWithAssignees[],
) => {
  setItems(
    items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
  );
};

const ActionItems = ({
  actionItems: initialItems,
  healthCheckId,
  teamId,
  questionId,
  teamMembers,
}: ActionItemsProps) => {
  const { mutate: createActionItem, isPending: isCreating } =
    useCreateActionItem();
  const { mutate: updateActionItem, isPending: isUpdating } =
    useUpdateActionItem();
  const { mutate: deleteActionItem, isPending: isDeleting } =
    useDeleteActionItem();

  const [items, setItems] = useState<ActionItemWithAssignees[]>([]);
  const [openStatusPopovers, setOpenStatusPopovers] = useState<
    Record<string, boolean>
  >({});
  const [openPriorityPopovers, setOpenPriorityPopovers] = useState<
    Record<string, boolean>
  >({});
  const [openDatePopovers, setOpenDatePopovers] = useState<
    Record<string, boolean>
  >({});
  const [openAssigneePopovers, setOpenAssigneePopovers] = useState<
    Record<string, boolean>
  >({});

  useActionItemsByTeamsSubscription(String(teamId));
  useActionItemAssignSubscription(String(teamId));

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{ title: string }>({
    defaultValues: { title: '' },
  });

  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  const onSubmit = handleSubmit((data) => {
    if (!data.title.trim()) return;

    const newAction = {
      title: data.title,
      status: ActionStatus.TODO,
      priority: ActionPriority.MEDIUM,
      health_check_id: healthCheckId,
      team_id: teamId,
      question_id: questionId,
    } as ActionItem;

    const optimisticAction: ActionItemWithAssignees = {
      ...newAction,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      action_item_assignees: [],
    };

    setItems((prevItems) => [optimisticAction, ...prevItems]);
    reset();
    createActionItem(newAction);
  });

  const setActionStatus = (id: string, status: ActionStatus) => {
    updateItemState(id, { status }, setItems, items);
    setOpenStatusPopovers({ ...openStatusPopovers, [id]: false });
    updateActionItem({ id, actionItem: { status } });
  };

  const setDueDate = (id: string, date?: Date) => {
    if (!date) return;
    const due_date = date.toLocaleDateString('en-CA');
    updateItemState(id, { due_date }, setItems, items);
    setOpenDatePopovers({ ...openDatePopovers, [id]: false });
    updateActionItem({ id, actionItem: { due_date } });
  };

  const setPriority = (id: string, priority: ActionPriority) => {
    updateItemState(id, { priority }, setItems, items);
    setOpenPriorityPopovers({ ...openPriorityPopovers, [id]: false });
    updateActionItem({ id, actionItem: { priority } });
  };

  return (
    <div className="w-full bg-white">
      <EntryForm
        register={register}
        onSubmit={onSubmit}
        isDisabled={isSubmitting || isCreating}
        placeholder="Add new action..."
        Icon={CheckCircle}
      />

      <div className="max-h-5/6 overflow-y-auto">
        {items.length === 0 ? (
          <div className="border py-4 text-center text-sm text-gray-400">
            No actions yet
          </div>
        ) : (
          items.map((item) => (
            <ActionItemRow
              key={item.id}
              item={item}
              openStatusPopovers={openStatusPopovers}
              setOpenStatusPopovers={setOpenStatusPopovers}
              openPriorityPopovers={openPriorityPopovers}
              setOpenPriorityPopovers={setOpenPriorityPopovers}
              openDatePopovers={openDatePopovers}
              setOpenDatePopovers={setOpenDatePopovers}
              setActionStatus={setActionStatus}
              setPriority={setPriority}
              setDueDate={setDueDate}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              onDelete={() => deleteActionItem({ actionItemId: item.id })}
              teamMembers={teamMembers}
              openAssigneePopovers={openAssigneePopovers}
              setOpenAssigneePopovers={setOpenAssigneePopovers}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ActionItems;
