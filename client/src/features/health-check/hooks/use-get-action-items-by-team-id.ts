import { useQuery } from '@tanstack/react-query';

import { actionItemService } from '../api/action-item';

export const useGetActionItemsByTeamId = (teamId: string) => {
  const getActionItems = async () => {
    const response = await actionItemService.getByTeamId(teamId);

    return response;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['get-action-items-by-teamId', teamId],
    queryFn: getActionItems,
    enabled: !!teamId,
  });

  return { data, isLoading };
};

export const useGetOpenActionItemsByTeamId = (teamId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-action-items-by-teamId', 'open', teamId],
    queryFn: () => actionItemService.getOpenByTeamId(teamId),
    enabled: !!teamId,
  });

  return { data, isLoading };
};

export const useGetDoneActionItemsByTeamId = (teamId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-action-items-by-teamId', 'done', teamId],
    queryFn: () => actionItemService.getDoneByTeamId(teamId),
    enabled: !!teamId,
  });

  return { data, isLoading };
};

export const useGetBlockActionItemsByTeamId = (teamId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-action-items-by-teamId', 'block', teamId],
    queryFn: () => actionItemService.getBlockByTeamId(teamId),
    enabled: !!teamId,
  });

  return { data, isLoading };
};

export const useGetActionItemsByTeamIdFromRecentHealthChecks = (
  teamId: string,
  numOfRecentHealthChecks: number,
) => {
  return useQuery({
    queryKey: ['get-action-items-by-teamId', teamId],
    queryFn: () =>
      actionItemService.getByTeamIdFromRecentHealthChecks(
        teamId,
        numOfRecentHealthChecks,
      ),
    enabled: !!teamId,
  });
};
