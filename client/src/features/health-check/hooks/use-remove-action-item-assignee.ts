import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { actionItemAssigneeService } from '../api/action-item-assigne';

export const useRemoveActionItemAssignee = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      actionItemId,
      teamUserIds,
    }: {
      actionItemId: string;
      teamUserIds: string[];
    }) => actionItemAssigneeService.remove(actionItemId, teamUserIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['action-items'],
      });
    },
    onError: (error) => {
      toast.error('Failed to remove user from action item', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
};
