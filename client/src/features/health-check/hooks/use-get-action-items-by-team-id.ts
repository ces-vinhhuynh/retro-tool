import { useQuery } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';

import { useActionItemsSubscription } from './use-action-items-subscription';

export const useGetActionItemsByTeamId = (teamId: string) => {
  useActionItemsSubscription(teamId);

  const { data, isLoading } = useQuery({
    queryKey: ['action-items', teamId],
    queryFn: () => actionItemService.getByTeamId(teamId),
  });

  return { data, isLoading };
};
