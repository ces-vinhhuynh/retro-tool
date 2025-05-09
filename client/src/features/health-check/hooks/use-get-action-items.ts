import { useQuery } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';

import { useActionItemsSubscription } from './use-action-items-subscription';

export const useGetActionItems = (healthCheckId: string) => {
  useActionItemsSubscription(healthCheckId);

  const { data, isLoading } = useQuery({
    queryKey: ['action-items', healthCheckId],
    queryFn: () => actionItemService.getByHealthCheckId(healthCheckId),
  });

  return { data, isLoading };
};
