import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { actionItemAssigneeService } from '../api/action-item-assigne';

export const useRemoveActionItemAssignee = () => {

  return useMutation({
    mutationFn: ({
      actionItemId,
      teamUserIds,
    }: {
      actionItemId: string;
      teamUserIds: string[];
    }) => actionItemAssigneeService.remove(actionItemId, teamUserIds),
    onSuccess: () => {

    },
    onError: () => {
      toast.error('Failed to remove user from action item');
    },
  });
};
