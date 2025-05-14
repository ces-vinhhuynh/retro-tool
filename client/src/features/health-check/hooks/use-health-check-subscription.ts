'use client';

import { useEffect, useState } from 'react';

import supabase from '@/lib/supabase/client';

import {HealthCheck} from '../types/health-check';

import {useHealthCheck} from './use-health-check';

export function useHealthCheckSubscription(id: string) {
  const { data: healthCheck, isLoading, error } = useHealthCheck(id);
  const [subscribedHealthCheck, setSubscribedHealthCheck] = useState<HealthCheck | null>(null);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`health_check:${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_checks',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          if (payload.new) {
            setSubscribedHealthCheck(payload.new as HealthCheck);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    if (healthCheck) {
      setSubscribedHealthCheck(healthCheck);
    }
  }, [healthCheck]);

  return {
    healthCheck: subscribedHealthCheck || healthCheck,
    isLoading,
    error,
  };
}
