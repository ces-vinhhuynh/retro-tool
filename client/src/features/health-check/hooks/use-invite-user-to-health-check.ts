import { FunctionsHttpError } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { healthCheckService } from '../api/health-check';

export function useInviteUserToHealthCheck() {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      userIds,
      healthCheckId,
    }: {
      userIds: string[];
      healthCheckId: string;
    }) => {
      const { data, error } = await healthCheckService.inviteUsers(
        userIds,
        healthCheckId,
      );

      if (error) {
        if (error instanceof FunctionsHttpError) {
          const errorMessage = await error.context.json();
          throw new Error(errorMessage.error);
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Invitation sent successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to invite user to health check', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
}
