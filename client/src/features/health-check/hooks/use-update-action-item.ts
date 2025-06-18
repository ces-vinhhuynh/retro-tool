import { useMutation } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';
import { ActionItem } from '../types/health-check';

export const useUpdateActionItem = () => {
  return useMutation({
    mutationFn: ({
      id,
      actionItem,
    }: {
      id: string;
      actionItem: Partial<ActionItem>;
    }) => actionItemService.update(id, actionItem),
    onSuccess: () => {},
    onError: () => {
      console.error('Error updating action item');
    },
  });
};
