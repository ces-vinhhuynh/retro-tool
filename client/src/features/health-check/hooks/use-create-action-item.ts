import { useMutation, useQueryClient } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';
import { ActionItem } from '../types/health-check';

export const useCreateActionItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (actionItem: ActionItem) =>
      actionItemService.create(actionItem),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['create-action-items'],
      });
      queryClient.invalidateQueries({
        queryKey: ['get-action-items-by-teamId', data.team_id],
      });
    },
    onError: () => {
      console.error('Error creating action item');
    },
  });
};
