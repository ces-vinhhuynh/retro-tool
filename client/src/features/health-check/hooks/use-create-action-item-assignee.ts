import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { actionItemAssigneeService } from '../api/action-item-assigne';

export const useCreateActionItemAssignee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      actionItemId,
      teamUserIds,
    }: {
      actionItemId: string;
      teamUserIds: string[];
    }) => actionItemAssigneeService.create(actionItemId, teamUserIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-action-items-by-teamId'],
      });
    },
    onError: () => {
      toast.error('Failed to assign user to action item');
    },
  });
};
