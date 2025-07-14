import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { healthCheckService } from '../api/health-check';

export const useUpdateFacilitators = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      id,
      facilitatorIds,
    }: {
      id: string;
      facilitatorIds: string[];
    }) => healthCheckService.updateFacilitators(id, facilitatorIds),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['health-checks', data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['healthCheck', data.id],
      });
    },
    onError: (error) => {
      toast.error('Error updating facilitators', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
};
