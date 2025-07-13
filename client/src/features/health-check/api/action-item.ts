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
    return data as ActionItemWithAssignees[];
  }

  async getByTeamIdFromRecentHealthChecks(
    teamId: string,
    numOfRecentHealthChecks: number,
  ): Promise<ActionItemWithAssignees[]> {
    // Step 1: Get recent health checks with created_at
    const { data: recentHealthChecks, error: healthCheckError } =
      await supabaseClient
        .from('health_checks')
        .select('id, created_at')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })
        .limit(numOfRecentHealthChecks);

    if (healthCheckError) throw healthCheckError;

    // If no health checks found, get all action items for this team
    if (!recentHealthChecks || recentHealthChecks.length === 0) {
      const { data: allActionItems, error: allError } = await supabaseClient
        .from('action_items')
        .select(`*, action_item_assignees(*, team_users(*, users(*)))`)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (allError) throw allError;
      return (allActionItems || []) as ActionItemWithAssignees[];
    }

    const healthCheckIds = recentHealthChecks.map((hc) => hc.id);
    const cutoffDate =
      recentHealthChecks[recentHealthChecks.length - 1].created_at;

    // Step 2: Single query with OR condition
    const { data, error } = await supabaseClient
      .from('action_items')
      .select(`*, action_item_assignees(*, team_users(*, users(*)))`)
      .eq('team_id', teamId)
      .or(
        `health_check_id.in.(${healthCheckIds.join(',')}),and(health_check_id.is.null,created_at.gt.${cutoffDate})`,
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ActionItemWithAssignees[];
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

  async getOpenByTeamId(teamId: string): Promise<ActionItemWithAssignees[]> {
    const { data, error } = await supabaseClient
      .from('action_items')
      .select(`*, action_item_assignees(*, team_users(*, users(*)))`)
      .eq('team_id', teamId)
      .in('status', ['todo', 'in_progress'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ActionItemWithAssignees[];
  }

  async getDoneByTeamId(teamId: string): Promise<ActionItemWithAssignees[]> {
    const { data, error } = await supabaseClient
      .from('action_items')
      .select(`*, action_item_assignees(*, team_users(*, users(*)))`)
      .eq('team_id', teamId)
      .eq('status', 'done')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ActionItemWithAssignees[];
  }

  async getBlockByTeamId(teamId: string): Promise<ActionItemWithAssignees[]> {
    const { data, error } = await supabaseClient
      .from('action_items')
      .select(`*, action_item_assignees(*, team_users(*, users(*)))`)
      .eq('team_id', teamId)
      .eq('status', 'blocked')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ActionItemWithAssignees[];
  }
}

export const actionItemService = new ActionItemService();
