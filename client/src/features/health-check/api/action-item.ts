import supabaseClient from '@/lib/supabase/client';

import { ActionItem, ActionItemWithAssignees } from '../types/health-check';

class ActionItemService {

  async getByActionId(actionId: string): Promise<ActionItem> {
    const { data, error } = await supabaseClient
      .from('action_items')
      .select('*')
      .eq('id', actionId)
      .single();

    if (error) throw error;
    return data;
  }

  async getByHealthCheckId(healthCheckId: string): Promise<ActionItem[]> {
    const { data, error } = await supabaseClient
      .from('action_items')
      .select('*')
      .eq('health_check_id', healthCheckId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getByTeamId(teamId: string): Promise<ActionItemWithAssignees[]> {
    const { data, error } = await supabaseClient
      .from('action_items')

      .select(`*, action_item_assignees(*, team_users(*, users(*)))`)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getByTeamIds(teamIds: string[]): Promise<ActionItem[]> {
    const { data, error } = await supabaseClient
      .from('action_items')
      .select(`*`)
      .in('team_id', teamIds)
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
