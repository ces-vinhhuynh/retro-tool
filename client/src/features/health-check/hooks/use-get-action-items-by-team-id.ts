import { useQuery } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';
import { useSubMenuStore } from '../stores/sub-menu-store';

export const useGetActionItemsByTeamId = (teamId: string) => {
  const { setActionItems } = useSubMenuStore();

  const getActionItems = async () => {
    const response = await actionItemService.getByTeamId(teamId);
    setActionItems(response);
    return response;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['get-action-items-by-teamId'],
    queryFn: getActionItems,
    enabled: !!teamId,
  });

  return { data, isLoading };
};
