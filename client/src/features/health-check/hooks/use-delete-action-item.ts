import { useMutation, useQueryClient } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';

export const useDeleteActionItem = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ actionItemId }: { actionItemId: string }) =>
      actionItemService.delete(actionItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['action-items'],
      });
    },
    onError: (error) => {
      console.error('Error deleting action item:', error);
    },
  });

  return { mutate, isPending };
};
