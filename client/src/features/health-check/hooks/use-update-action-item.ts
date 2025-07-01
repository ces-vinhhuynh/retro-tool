import { useMutation, useQueryClient } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';
import { ActionItem } from '../types/health-check';

export const useUpdateActionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      actionItem,
    }: {
      id: string;
      actionItem: Partial<ActionItem>;
    }) => actionItemService.update(id, actionItem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-action-items-by-teamId'],
      });
    },
    onError: () => {
      console.error('Error updating action item');
    },
  });
};
