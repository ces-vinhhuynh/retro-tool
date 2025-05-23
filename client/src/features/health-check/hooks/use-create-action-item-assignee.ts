import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { actionItemAssigneeService } from '../api/action-item-assigne';

export const useCreateActionItemAssignee = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      actionItemId,
      teamUserIds,
    }: {
      actionItemId: string;
      teamUserIds: string[];
    }) => actionItemAssigneeService.create(actionItemId, teamUserIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['action-items'],
      });
      queryClient.invalidateQueries({
        queryKey: ['action-item-assignees'],
      });
    },
    onError: (error) => {
      toast.error('Failed to assign user to action item', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
};
