import supabaseClient from '@/lib/supabase/client';

import { WorkspaceUser } from '../types/workspace-users';

class WorkspaceUsersService {
  async getWorkspaces() {
    const { data, error } = await supabaseClient
      .from('workspace_users')
      .select(
        `
        *,
        workspace:workspaces (
          id,
          name
        )
      `,
      )
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async create(workspaceUser: WorkspaceUser): Promise<WorkspaceUser> {
    const { data, error } = await supabaseClient
      .from('workspace_users')
      .insert(workspaceUser)
      .single();

    if (error) throw error;
    return data;
  }
}

export const workspaceUsersService = new WorkspaceUsersService();
