import { useQuery } from '@tanstack/react-query';

import { issuesService } from '../../api/issues';
import { useSubMenuStore } from '../../stores/sub-menu-store';

export const useIssuesQuery = (teamId: string) => {
  const { setIssues } = useSubMenuStore();

  const getIssues = async () => { 
    const response = await issuesService.getByTeamId(teamId);
    setIssues(response);
    return response;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['issues', teamId],
    queryFn: getIssues,
    enabled: !!teamId,
  });

  return { data, isLoading };
};
