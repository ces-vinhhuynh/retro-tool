import { useMutation, useQueryClient } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';

export const useDeleteActionItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ actionItemId }: { actionItemId: string }) =>
      actionItemService.delete(actionItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-action-items-by-teamId'],
      });
    },
    onError: () => {
      console.error('Error deleting action item');
    },
  });
};
