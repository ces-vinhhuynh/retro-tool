import { useQuery } from '@tanstack/react-query';

import { responseService } from '../api/response';

export const useResponse = (healthCheckId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['responses', healthCheckId],
    queryFn: () => responseService.getResponses(healthCheckId),
  });

  return {
    responses: data,
    isLoading,
  };
};
