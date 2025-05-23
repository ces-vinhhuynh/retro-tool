import supabaseClient from '@/lib/supabase/client';

import { ActionItemAssignee } from '../types/action-item-assigne';

class ActionItemAssigneeService {
  async create(
    actionItemId: string,
    teamUserIds: string[],
  ): Promise<ActionItemAssignee[]> {
    const { data, error } = await supabaseClient
      .from('action_item_assignees')
      .insert(
        teamUserIds.map((teamUserId) => ({
          action_item_id: actionItemId,
          team_user_id: teamUserId,
        })),
      )
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }

  async remove(actionItemId: string, teamUserIds: string[]) {
    const { data, error } = await supabaseClient
      .from('action_item_assignees')
      .delete()
      .eq('action_item_id', actionItemId)
      .in('team_user_id', teamUserIds);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getAssignees(actionItemId: string) {
    const { data, error } = await supabaseClient
      .from('action_item_assignees')
      .select(
        `
      team_user:team_users (
        id,
        role,
        user:users (
          id,
          full_name,
          email
        )
      )
    `,
      )
      .eq('action_item_id', actionItemId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
export const actionItemAssigneeService = new ActionItemAssigneeService();
