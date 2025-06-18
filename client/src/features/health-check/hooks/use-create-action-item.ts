import { useMutation, useQueryClient } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';
import { ActionItem } from '../types/health-check';

export const useCreateActionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (actionItem: ActionItem) =>
      actionItemService.create(actionItem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['create-action-items'],
      });
    },
    onError: () => {
      console.error('Error creating action item');
    },
  });
};
