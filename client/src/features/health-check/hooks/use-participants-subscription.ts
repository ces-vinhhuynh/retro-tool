import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';

export const useParticipantsSubscription = (healthCheckId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabaseClient
      .channel(`participants_${healthCheckId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `health_check_id=eq.${healthCheckId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['participants', healthCheckId],
          });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [healthCheckId, queryClient]);
};
