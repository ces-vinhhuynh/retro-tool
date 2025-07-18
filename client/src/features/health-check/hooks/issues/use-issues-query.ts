import { useQuery } from '@tanstack/react-query';

import { issuesService } from '../../api/issues';

export const useIssuesQuery = (teamId: string) => {
  const getIssues = async () => {
    const response = await issuesService.getByTeamId(teamId);

    return response;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['issues', teamId],
    queryFn: getIssues,
    enabled: !!teamId,
  });

  return { data, isLoading };
};
