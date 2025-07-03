'use client';

import { Calendar, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

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

interface DashboardActionItemsProps {
  actionItems: ActionItemWithAssignees[];
  teamId?: string;
  teamMembers: User[];
  healthChecks: HealthCheck[];
  showEntryForm?: boolean;
  onEntryFormToggle?: () => void;
}

const DashboardActionItems = ({
  actionItems,
  teamId,
  teamMembers,
  healthChecks,
  showEntryForm = false,
  onEntryFormToggle,
}: DashboardActionItemsProps) => {
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
      team_id: teamId,
    } as ActionItem;

    createActionItem(newAction);
    reset();

    // Hide EntryForm after successful creation
    if (onEntryFormToggle) {
      onEntryFormToggle();
    }
  });

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Always show EntryForm when showEntryForm is true */}
      {showEntryForm && (
        <div className="mb-3 flex-shrink-0">
          <EntryForm
            register={register}
            onSubmit={onSubmit}
            isDisabled={isSubmitting || isCreating}
            placeholder="Add new action..."
            Icon={CheckCircle}
          />
        </div>
      )}

      {/* Content area */}
      <div className="flex flex-1 flex-col">
        {actionItems.length === 0 ? (
          // Empty state - different message based on whether form is showing
          <div className="text-muted-foreground flex flex-1 flex-col justify-center text-center">
            {showEntryForm ? (
              <p className="py-4 text-sm">Add your first action item above</p>
            ) : (
              <>
                <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No action items yet</p>
              </>
            )}
          </div>
        ) : (
          // Show action items
          <div className="max-h-full overflow-auto">
            <div className="w-fit min-w-full">
              {actionItems.map((item) => (
                <ActionItemRow
                  key={item.id}
                  item={item}
                  isDeleting={isDeleting}
                  onDelete={() => deleteActionItem({ actionItemId: item.id })}
                  teamMembers={teamMembers}
                  healthChecks={healthChecks}
                  isHandlingOpenLink
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardActionItems;
