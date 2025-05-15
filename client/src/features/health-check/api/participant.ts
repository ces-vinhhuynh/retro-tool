import supabaseClient from '@/lib/supabase/client';

import { Participant, ParticipantWithUser } from '../types/health-check';

export const participantService = {
  create: async (
    healthCheckId: string,
    userId: string,
  ): Promise<Participant | null> => {
    const { data, error } = await supabaseClient
      .from('participants')
      .insert({
        health_check_id: healthCheckId,
        user_id: userId,
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  getAll: async (
    healthCheckId: string,
  ): Promise<ParticipantWithUser[]> => {
    const { data, error } = await supabaseClient
      .from('participants')
      .select(
        `*,
        user:users (
          id,
          full_name,
          avatar_url,
          email,
          created_at,
          updated_at
        )`,
      )
      .eq('health_check_id', healthCheckId)
      .order('last_active', { ascending: false });

    if (error) throw error;
    return data;
  },

  update: async (
    healthCheckId: string,
    userId: string,
    updates: Partial<Participant>,
  ): Promise<Participant> => {
    const { data, error } = await supabaseClient
      .from('participants')
      .update(updates)
      .eq('health_check_id', healthCheckId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },
};
