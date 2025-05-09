import { useQuery } from '@tanstack/react-query';

import { healthCheckService } from '../api/health-check';

export const useHealthCheck = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['health-check', id],
    queryFn: () => healthCheckService.getById(id),
  });

  return {
    healthCheck: data,
    isLoading,
  };
};
