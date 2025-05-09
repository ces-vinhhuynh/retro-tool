import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';

import { ActionItem } from '../types/health-check';

export const useActionItemsSubscription = (healthCheckId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabaseClient
      .channel(`action_items_${healthCheckId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'action_items',
          filter: `health_check_id=eq.${healthCheckId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newItem = payload.new as ActionItem;

            queryClient.setQueryData<ActionItem[]>(
              ['action-items', healthCheckId],
              (oldData) => {
                if (!oldData) return [newItem];

                const exists = oldData.some((item) => item.id === newItem.id);
                if (exists) return oldData;

                return [newItem, ...oldData];
              },
            );
          } else if (payload.eventType === 'UPDATE') {
            const updatedItem = payload.new as ActionItem;

            queryClient.setQueryData<ActionItem[]>(
              ['action-items', healthCheckId],
              (oldData) => {
                if (!oldData) return [updatedItem];

                return oldData.map((item) =>
                  item.id === updatedItem.id ? updatedItem : item,
                );
              },
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedItem = payload.old as ActionItem;

            queryClient.setQueryData<ActionItem[]>(
              ['action-items', healthCheckId],
              (oldData) => {
                if (!oldData) return [];

                return oldData.filter((item) => item.id !== deletedItem.id);
              },
            );
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [healthCheckId, queryClient]);
};
