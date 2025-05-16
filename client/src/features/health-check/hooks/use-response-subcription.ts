import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';

export const useResponsesSubscription = (healthCheckId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabaseClient
      .channel(`responses_${healthCheckId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'responses',
          filter: `health_check_id=eq.${healthCheckId}`,
        },
        (payload) => {
          if (
            payload.eventType === 'INSERT' ||
            payload.eventType === 'UPDATE'
          ) {
            // Invalidate all responses-related queries to fetch the latest data
            // This ensures all components using response data get updated
            queryClient.invalidateQueries({
              queryKey: ['responses', healthCheckId],
            });
            queryClient.invalidateQueries({
              queryKey: ['response', healthCheckId],
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
