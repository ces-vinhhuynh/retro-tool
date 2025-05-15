import { useQuery } from '@tanstack/react-query';

import { teamService } from '../api/team';

export function useGetTeamsByWorkspace(
  workspaceId: string,
  options?: { enabled: boolean },
) {
  const { data, isLoading } = useQuery({
    queryKey: ['teams', workspaceId],
    queryFn: () => teamService.getTeams(workspaceId),
    ...options,
  });

  return { data, isLoading };
}
