import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { participantService } from '../api/participant';

export const useCreateParticipant = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      healthCheckId,
      userId,
    }: {
      healthCheckId: string;
      userId: string;
    }) => participantService.create(healthCheckId, userId),
    onSuccess: (_, { healthCheckId }) => {
      queryClient.invalidateQueries({
        queryKey: ['participants', healthCheckId],
      });
    },
    onError: (error) => {
      toast.error('Failed to create participant:', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
};
