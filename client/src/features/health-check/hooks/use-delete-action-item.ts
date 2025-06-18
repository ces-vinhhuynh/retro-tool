import { useMutation } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';

export const useDeleteActionItem = () => {
  return useMutation({
    mutationFn: ({ actionItemId }: { actionItemId: string }) =>
      actionItemService.delete(actionItemId),
    onSuccess: () => {},
    onError: () => {
      console.error('Error deleting action item');
    },
  });
};
