import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { actionItemAssigneeService } from '../api/action-item-assigne';

export const useCreateActionItemAssignee = () => {
  return useMutation({
    mutationFn: ({
      actionItemId,
      teamUserIds,
    }: {
      actionItemId: string;
      teamUserIds: string[];
    }) => actionItemAssigneeService.create(actionItemId, teamUserIds),
    onSuccess: () => {},
    onError: () => {
      toast.error('Failed to assign user to action item');
    },
  });
};
