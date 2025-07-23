import { useQuery } from '@tanstack/react-query';

import { healthCheckService } from '../api/health-check';

export function useGetLatestHealthCheckForFacilitator(
  userId: string,
) {
  return useQuery({
    queryKey: ['latest-health-check-by-facilitator', userId],
    queryFn: () =>
      healthCheckService.getLatestHealthCheckForFacilitator(userId),
    enabled: !!userId,
  });
}
