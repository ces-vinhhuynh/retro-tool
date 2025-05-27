import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';

export const useAgreementsSubscription = (teamId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabaseClient
      .channel(`agreements_team_${teamId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agreements',
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['agreements', teamId],
          });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [teamId, queryClient]);
};
