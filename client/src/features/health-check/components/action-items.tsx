'use client';

import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { ActionItemRow } from '@/features/health-check/components/action-item-row';
import { useCreateActionItem } from '@/features/health-check/hooks/use-create-action-item';
import { useDeleteActionItem } from '@/features/health-check/hooks/use-delete-action-item';
import {
  ActionItem,
  ActionItemWithAssignees,
  ActionPriority,
  ActionStatus,
  HealthCheck,
  User,
} from '@/features/health-check/types/health-check';

import EntryForm from './entry-form';

interface ActionItemsProps {
  actionItems: ActionItemWithAssignees[];
  teamId?: string;
  healthCheckId?: string;
  questionId?: string;
  teamMembers: User[];
  healthChecks?: HealthCheck[];
  isHandlingOpenLink?: boolean;
  isEditable?: boolean;
  isAdmin?: boolean;
}

const ActionItems = ({
  actionItems,
  healthCheckId,
  teamId,
  questionId,
  teamMembers,
  healthChecks,
  isHandlingOpenLink = false,
  isEditable = true,
  isAdmin = false,
}: ActionItemsProps) => {
  const [showAll, setShowAll] = useState(false);

  const { mutate: createActionItem, isPending: isCreating } =
    useCreateActionItem();

  const { mutate: deleteActionItem, isPending: isDeleting } =
    useDeleteActionItem();

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

  const visibleItems = showAll ? actionItems : actionItems.slice(0, 5);

  return (
    <div className="flex w-full flex-col items-center gap-3 bg-white">
      <div className="w-full pb-3">
        <EntryForm
          register={register}
          onSubmit={onSubmit}
          isDisabled={isSubmitting || isCreating}
          placeholder="Add new action..."
          Icon={CheckCircle}
        />
      </div>
      <div className="max-h-5/6 w-full overflow-auto">
        {actionItems.length === 0 ? (
          <div className="border py-4 text-center text-sm text-gray-400">
            No actions yet
          </div>
        ) : (
          <div className="w-fit min-w-full">
            {visibleItems.map((item) => (
              <ActionItemRow
                key={item.id}
                item={item}
                isDeleting={isDeleting}
                onDelete={() => deleteActionItem({ actionItemId: item.id })}
                teamMembers={teamMembers}
                healthChecks={healthChecks}
                isHandlingOpenLink={isHandlingOpenLink}
                isEditable={isEditable}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>
      {actionItems.length > 5 && (
        <Button
          className="w-fit"
          variant="outline"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? 'Show less' : 'Show all'}
        </Button>
      )}
    </div>
  );
};

export default ActionItems;
