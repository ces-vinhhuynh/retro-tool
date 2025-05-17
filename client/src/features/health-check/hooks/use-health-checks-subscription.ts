import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';

export const useHealthChecksSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabaseClient
      .channel(`health_checks`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_checks',
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['healthChecks'],
          });
          queryClient.invalidateQueries({
            queryKey: ['health-check-by-team-and-template'],
          });
          queryClient.invalidateQueries({
            queryKey: ['responses'],
          });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};
