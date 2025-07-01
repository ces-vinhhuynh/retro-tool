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
  User,
} from '@/features/health-check/types/health-check';

import { useActionItemAssignSubscription } from '../hooks/use-action-item-assign-subscription';
import { useActionItemsByTeamsSubscription } from '../hooks/use-action-items-by-teams-subscriptions';

import EntryForm from './entry-form';

interface DashboardActionItemsProps {
  actionItems: ActionItemWithAssignees[];
  teamId?: string;
  teamMembers: User[];
  showEntryForm?: boolean; // New prop to control EntryForm visibility
  onEntryFormToggle?: () => void; // Callback to toggle EntryForm
}

const DashboardActionItems = ({
  actionItems,
  teamId,
  teamMembers,
  showEntryForm = false,
  onEntryFormToggle,
}: DashboardActionItemsProps) => {
  const { mutate: createActionItem, isPending: isCreating } =
    useCreateActionItem();

  const { mutate: deleteActionItem, isPending: isDeleting } =
    useDeleteActionItem();

  // useActionItemsByTeamsSubscription(String(teamId));
  // useActionItemAssignSubscription(String(teamId));

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

  // Limit to top 3 action items for dashboard
  const displayedActionItems = actionItems.slice(0, 3);

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Always show EntryForm when showEntryForm is true */}
      {showEntryForm && (
        <div className="mb-4 flex-shrink-0">
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
        {displayedActionItems.length === 0 ? (
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
              {displayedActionItems.map((item) => (
                <ActionItemRow
                  key={item.id}
                  item={item}
                  isDeleting={isDeleting}
                  onDelete={() => deleteActionItem({ actionItemId: item.id })}
                  teamMembers={teamMembers}
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
