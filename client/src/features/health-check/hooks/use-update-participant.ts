import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { participantService } from '../api/participant';
import { Participant } from '../types/health-check';

export const useUpdateParticipant = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      healthCheckId,
      userId,
      updates,
    }: {
      healthCheckId: string;
      userId: string;
      updates: Partial<Participant>;
    }) => participantService.update(healthCheckId, userId, updates),
    onSuccess: (_, { healthCheckId }) => {
      queryClient.invalidateQueries({
        queryKey: ['participants', healthCheckId],
      });
    },
    onError: (error) => {
      toast.error('Failed to update participant:', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
};
