import { useQuery } from '@tanstack/react-query';

import { agreementsService } from '../../api/agreements';

export const useAgreementsQuery = (teamId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['agreements', teamId],
    queryFn: () => agreementsService.getByTeamId(teamId),
    enabled: !!teamId,
  });

  return { data, isLoading };
};
