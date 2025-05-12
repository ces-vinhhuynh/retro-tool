import supabaseClient from '@/lib/supabase/client';

import { ActionItem } from '../types/health-check';

class ActionItemService {
  async getByHealthCheckId(healthCheckId: string): Promise<ActionItem[]> {
    const { data, error } = await supabaseClient
      .from('action_items')
      .select('*')
      .eq('health_check_id', healthCheckId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async create(actionItem: ActionItem): Promise<ActionItem> {
    const { data, error } = await supabaseClient
      .from('action_items')
      .insert(actionItem)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(
    id: string,
    actionItem: Partial<ActionItem>,
  ): Promise<ActionItem> {
    const { data, error } = await supabaseClient
      .from('action_items')
      .update(actionItem)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from('action_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const actionItemService = new ActionItemService();
