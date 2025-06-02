import { useQuery } from '@tanstack/react-query';

import { agreementsService } from '../../api/agreements';
import { useSubMenuStore } from '../../stores/sub-menu-store';

export const useAgreementsQuery = (teamId: string) => {
  const { setAgreements } = useSubMenuStore();

  const getAgreements = async () => {
    const response = await agreementsService.getByTeamId(teamId);
    setAgreements(response);
    return response;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['agreements', teamId],
    queryFn: getAgreements,
    enabled: !!teamId,
  });

  return { data, isLoading };
};
