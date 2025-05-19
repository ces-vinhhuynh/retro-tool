import { useQuery } from '@tanstack/react-query';

import { teamService } from '../api/team';

export function useGetWorkspaceTeams(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['workspace-teams', id],
    queryFn: () => teamService.getByWorkspaceId(id),
    placeholderData: [],
  });

  return { data, isLoading };
}
