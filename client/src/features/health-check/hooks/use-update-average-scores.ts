import { FunctionsHttpError } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { healthCheckService } from '../api/health-check';

export function useUpdateAverageScores() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ healthCheckId }: { healthCheckId: string }) => {
      const { data, error } =
        await healthCheckService.updateAverageScores(healthCheckId);

      if (error) {
        if (error instanceof FunctionsHttpError) {
          const errorData = await error.context.json();
          throw new Error(errorData.error || error.message);
        }
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from server');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['healthCheck', data.id] });
      queryClient.invalidateQueries({ queryKey: ['healthChecks'] });
      queryClient.invalidateQueries({
        queryKey: [
          'health-check-by-team-and-template',
          data.template_id,
          data.team_id,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['health-checks', data.id],
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to update average scores', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
}
