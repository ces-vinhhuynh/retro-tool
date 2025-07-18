import { useQuery } from '@tanstack/react-query';

import { agreementsService } from '../../api/agreements';

export const useAgreementsQuery = (teamId: string) => {
  const getAgreements = async () => {
    const response = await agreementsService.getByTeamId(teamId);

    return response;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['agreements', teamId],
    queryFn: getAgreements,
    enabled: !!teamId,
  });

  return { data, isLoading };
};
