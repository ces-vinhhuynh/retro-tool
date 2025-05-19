'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import ActionItemForm, {
  AddActionFormData,
} from '@/features/health-check/components/action-item-form';
import ActionItemRow from '@/features/health-check/components/action-item-row';
import { useCreateActionItem } from '@/features/health-check/hooks/use-create-action-item';
import { useDeleteActionItem } from '@/features/health-check/hooks/use-delete-action-item';
import { useUpdateActionItem } from '@/features/health-check/hooks/use-update-action-item';
import {
  ActionItem,
  ActionPriority,
  ActionStatus,
} from '@/features/health-check/types/health-check';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
} from '@/features/health-check/utils/constants';

interface ActionItemsProps {
  actionItems: ActionItem[];
  teamId?: string;
  healthCheckId?: string;
  questionId?: string;
}

const ActionItems = ({
  actionItems: initialItems,
  healthCheckId,
  teamId,
  questionId,
}: ActionItemsProps) => {
  const { mutate: createActionItem, isPending: isCreating } =
    useCreateActionItem();
  const { mutate: updateActionItem, isPending: isUpdating } =
    useUpdateActionItem();

  const { mutate: deleteActionItem, isPending: isDeleting } =
    useDeleteActionItem();

  const [items, setItems] = useState<ActionItem[]>([]);
  const [openStatusPopovers, setOpenStatusPopovers] = useState<
    Record<string, boolean>
  >({});
  const [openPriorityPopovers, setOpenPriorityPopovers] = useState<
    Record<string, boolean>
  >({});
  const [openDatePopovers, setOpenDatePopovers] = useState<
    Record<string, boolean>
  >({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AddActionFormData>({
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

    const tempId = Date.now().toString();
    const optimisticAction = {
      ...newAction,
      id: tempId,
      created_at: new Date().toISOString(),
    };

    setItems((prevItems) => [optimisticAction, ...prevItems]);
    reset();
    createActionItem(newAction);
  });

  const setActionStatus = (id: string, status: ActionStatus) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, status } : item)),
    );

    setOpenStatusPopovers({ ...openStatusPopovers, [id]: false });

    updateActionItem({ id, actionItem: { status } });
  };

  const setDueDate = (id: string, date?: Date) => {
    if (!date) return;

    const due_date = date.toLocaleDateString('en-CA');

    setItems(
      items.map((item) => (item.id === id ? { ...item, due_date } : item)),
    );

    setOpenDatePopovers({ ...openDatePopovers, [id]: false });

    updateActionItem({ id, actionItem: { due_date } });
  };

  const setPriority = (id: string, priority: ActionPriority) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, priority } : item)),
    );

    setOpenPriorityPopovers({ ...openPriorityPopovers, [id]: false });

    updateActionItem({ id, actionItem: { priority } });
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

  return (
    <div className="w-full bg-white">
      <ActionItemForm
        register={register}
        onSubmit={onSubmit}
        isDisabled={isSubmitting || isCreating}
      />

      <div>
        {items.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-400">
            no actions yet
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
              getStatusIcon={getStatusIcon}
              getPriorityIcon={getPriorityIcon}
              setActionStatus={setActionStatus}
              setPriority={setPriority}
              setDueDate={setDueDate}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              onDelete={() => deleteActionItem({ actionItemId: item.id })}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ActionItems;
