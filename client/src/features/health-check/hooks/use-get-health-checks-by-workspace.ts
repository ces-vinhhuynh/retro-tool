import { useQuery } from '@tanstack/react-query';

import { healthCheckService } from '../api/health-check';

export function useGetHealthChecksByWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ['health-checks-by-workspace', workspaceId],
    queryFn: () => healthCheckService.getByWorkspaceId(workspaceId),
    enabled: !!workspaceId,
  });
}
