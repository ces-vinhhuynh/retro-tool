import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { responseService } from '../api/response';
import { Response, ResponseInsert } from '../types/health-check';
import { toast } from 'sonner';

export function useResponses(healthCheckId: string) {
  return useQuery({
    queryKey: ['responses', healthCheckId],
    queryFn: () => responseService.getByHealthCheckId(healthCheckId),
    enabled: !!healthCheckId,
  });
}

export function useResponse(healthCheckId: string, userId: string) {
  return useQuery({
    queryKey: ['response', healthCheckId, userId],
    queryFn: () =>
      responseService.getByHealthCheckIdAndUserId(healthCheckId, userId),
    enabled: !!healthCheckId && !!userId,
  });
}

export const useCreateResponse = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (response: ResponseInsert) => responseService.create(response),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['response', data.health_check_id, data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['responses', data.health_check_id],
      });
    },
    onError: (error) => {
      console.error('Error creating response:', error);
    },
  });

  return { mutate, isPending };
};

export const useUpdateResponse = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (response: {
      id: string;
      questionId: string;
      answer: {
        rating?: number | null;
        comment?: string[];
        vote?: number;
      };
    }) =>
      responseService.update(response.id, response.questionId, response.answer),
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({
        queryKey: ['response', data.health_check_id, data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['responses', data.health_check_id],
      });
    },
    onError: () => {
      toast.error('Error updating response');
    },
  });

  return { mutate, isPending };
};
