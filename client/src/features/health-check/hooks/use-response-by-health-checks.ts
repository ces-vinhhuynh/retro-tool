import { useQuery } from '@tanstack/react-query';

import { responseService } from '../api/response';

export const useResponseByHealthChecks = (healthCheckIds: string[]) => {
  return useQuery({
    queryKey: ['responses', healthCheckIds],
    queryFn: () => responseService.getAllByHealthChecks(healthCheckIds),
  });
};
