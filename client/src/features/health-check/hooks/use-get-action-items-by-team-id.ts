import { useQuery } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';

export const useGetActionItemsByTeamId = (teamId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['action-items', teamId],
    queryFn: () => actionItemService.getByTeamId(teamId),
    enabled: !!teamId,
  });

  return { data, isLoading };
};
