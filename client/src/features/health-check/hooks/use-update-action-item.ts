import { useMutation, useQueryClient } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';
import { ActionItem } from '../types/health-check';

export const useUpdateActionItem = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      id,
      actionItem,
    }: {
      id: string;
      actionItem: Partial<ActionItem>;
    }) => actionItemService.update(id, actionItem),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['action-items', data.health_check_id],
      });
    },
    onError: (error) => {
      console.error('Error updating action item:', error);
    },
  });

  return { mutate, isPending };
};
