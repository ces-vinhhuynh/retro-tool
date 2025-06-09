import { useQuery } from '@tanstack/react-query';

import { templateService } from '../api/templates';

export const useTeamTemplates = (teamId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['health-check-templates', teamId],
    queryFn: () => templateService.getByTeamId(teamId),
  });

  return { data, isLoading };
};
