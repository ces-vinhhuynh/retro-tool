import { useQuery } from '@tanstack/react-query';

import { participantService } from '../api/participant';

export const useGetParticipants = (healthCheckId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['participants', healthCheckId],
    queryFn: () => participantService.getAll(healthCheckId),
  });

  return { data, isLoading };
};
