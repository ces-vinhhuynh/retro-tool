import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { responseService } from '../api/response';

export function useUpdateHealthCheckRating() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      responseId,
      healthCheckRating,
    }: {
      responseId: string;
      healthCheckRating?: number;
    }) =>
      responseService.updateHealthCheckRating(
        responseId,
        Number(healthCheckRating),
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['responses', data.id],
      });
    },
    onError: (error) => {
      toast.error('Error updating health check rating:', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
}
