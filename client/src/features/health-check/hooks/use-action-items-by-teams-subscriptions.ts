import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';

export const useActionItemsByTeamsSubscription = (teamId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabaseClient
      .channel(`action_items_${teamId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'action_items',
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['get-action-items-by-teamId'],
          });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [teamId, queryClient]);
};
