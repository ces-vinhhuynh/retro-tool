import { useQuery } from '@tanstack/react-query';

import { healthCheckService } from '../api/health-check';

export function useGetHealthChecksByTeam(teamId: string) {
  return useQuery({
    queryKey: ['query-health-check-by-team', teamId],
    queryFn: () => healthCheckService.getByTeamId(teamId),
    enabled: !!teamId,
  });
}
