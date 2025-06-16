import { useQuery } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';

export function useGetActionItemsByWorkspace(teamIds: string[]) {
  return useQuery({
    queryKey: ['action-items-by-team-ids', teamIds],
    queryFn: () => actionItemService.getByTeamIds(teamIds),
    enabled: !!teamIds,
  });
}
