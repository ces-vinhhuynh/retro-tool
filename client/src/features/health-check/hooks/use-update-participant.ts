import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { participantService } from '../api/participant';
import { Participant } from '../types/health-check';

export const useUpdateParticipant = () => {
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
    onSuccess: () => {
      // Handle success
    },
    onError: (error) => {
      toast.error('Failed to update participant:', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
};
