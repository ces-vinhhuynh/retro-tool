import { useQuery } from '@tanstack/react-query';

import { healthCheckService } from '../api/health-check';

export function useHealthCheckTemplates(id: string) {
  return useQuery({
    queryKey: ['health-check-template', id],
    queryFn: () => healthCheckService.getHealthCheckTemplatesById(id),
    enabled: !!id,
  });
}
