import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';

import { HealthCheck } from '../types/health-check';

export const useHealthCheckSubscription = (healthCheckId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabaseClient
      .channel(`health_check_${healthCheckId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_checks',
          filter: `id=eq.${healthCheckId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updatedHealthCheck = payload.new as HealthCheck;

            // Update the health check data in the query cache
            queryClient.setQueryData(
              ['healthCheck', healthCheckId],
              updatedHealthCheck,
            );
            queryClient.invalidateQueries({
              queryKey: [
                'health-check-by-team-and-template',
                updatedHealthCheck.template_id,
                updatedHealthCheck.team_id,
              ],
            });
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [healthCheckId, queryClient]);
};
