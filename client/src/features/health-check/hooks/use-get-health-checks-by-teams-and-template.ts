import { useQuery } from '@tanstack/react-query';

import { healthCheckService } from '../api/health-check';

export function useGetHealthChecksByTeamsAndTemplate(
  templateId: string,
  teamId: string,
) {
  return useQuery({
    queryKey: ['health-check-by-team-and-template', templateId, teamId],
    queryFn: () =>
      healthCheckService.getByTemplateIdAndTeamId(templateId, teamId),
    enabled: !!templateId && !!teamId,
  });
}
