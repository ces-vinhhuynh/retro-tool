import { useQuery } from '@tanstack/react-query';

import { issuesService } from '../../api/issues';

export const useIssuesQuery = (teamId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['issues', teamId],
    queryFn: () => issuesService.getByTeamId(teamId),
    enabled: !!teamId,
  });

  return { data, isLoading };
};
