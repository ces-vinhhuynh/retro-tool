import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';

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
        () => {
          queryClient.invalidateQueries({
            queryKey: ['healthCheck', healthCheckId],
          });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [healthCheckId, queryClient]);
};
