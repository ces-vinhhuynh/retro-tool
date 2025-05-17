import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';

export const useScrumHealthCheckSubscription = (
  templateId: string,
  teamId: string,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabaseClient
      .channel('health-check-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_checks',
          filter: `template_id=eq.${templateId} AND team_id=eq.${teamId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['health-check-by-team-and-template', templateId, teamId],
          });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [templateId, teamId, queryClient]);
};
