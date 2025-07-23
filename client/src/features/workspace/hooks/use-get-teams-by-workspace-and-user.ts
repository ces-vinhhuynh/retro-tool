import { useQuery } from '@tanstack/react-query';

import { teamService } from '../api/team';

export function useGetTeamsByWorkspaceAndUser(
  workspaceId: string,
  userId: string,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['workspace-teams', workspaceId, userId],
    queryFn: () => teamService.getByWorkspaceIdAndUserId(workspaceId, userId),
    enabled: !!workspaceId && !!userId,
  });

  return { data, isLoading };
}
