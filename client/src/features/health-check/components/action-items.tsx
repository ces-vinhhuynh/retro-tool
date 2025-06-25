'use client';

import { CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { ActionItemRow } from '@/features/health-check/components/action-item-row';
import { useCreateActionItem } from '@/features/health-check/hooks/use-create-action-item';
import { useDeleteActionItem } from '@/features/health-check/hooks/use-delete-action-item';
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
  isHandlingOpenLink?: boolean;
}

const ActionItems = ({
  actionItems,
  healthCheckId,
  teamId,
  questionId,
  teamMembers,
  isHandlingOpenLink,
}: ActionItemsProps) => {
  
  const { mutate: createActionItem, isPending: isCreating } =
    useCreateActionItem();

  const { mutate: deleteActionItem, isPending: isDeleting } =
    useDeleteActionItem();

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

    createActionItem(newAction);
    reset();
  });

  return (
    <div className="w-full bg-white">
      <EntryForm
        register={register}
        onSubmit={onSubmit}
        isDisabled={isSubmitting || isCreating}
        placeholder="Add new action..."
        Icon={CheckCircle}
      />

      <div className="max-h-5/6 overflow-auto">
        {actionItems.length === 0 ? (
          <div className="border py-4 text-center text-sm text-gray-400">
            No actions yet
          </div>
        ) : (
          <div className="w-fit min-w-full">
            {actionItems.map((item) => (
              <ActionItemRow
                key={item.id}
                item={item}
                isDeleting={isDeleting}
                onDelete={() => deleteActionItem({ actionItemId: item.id })}
                teamMembers={teamMembers}
                isHandlingOpenLink={isHandlingOpenLink || false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionItems;