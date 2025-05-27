import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';

export const useIssuesSubscription = (teamId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabaseClient
      .channel(`issues_team_${teamId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'issues',
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['issues', teamId],
          });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [teamId, queryClient]);
};
