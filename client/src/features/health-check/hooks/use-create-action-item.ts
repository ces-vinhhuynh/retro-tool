import { useMutation, useQueryClient } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';
import { ActionItem } from '../types/health-check';

export const useCreateActionItem = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (actionItem: ActionItem) =>
      actionItemService.create(actionItem),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['action-items', data.health_check_id],
      });
    },
    onError: (error) => {
      console.error('Error creating action item:', error);
    },
  });

  return { mutate, isPending };
};
