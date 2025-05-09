import { useQuery } from '@tanstack/react-query';

import { responseService } from '../api/response';

export const useResponse = (healthCheckId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['responses', healthCheckId],
    queryFn: () => responseService.getByHealthCheckId(healthCheckId),
  });

  return {
    responses: data,
    isLoading,
  };
};
