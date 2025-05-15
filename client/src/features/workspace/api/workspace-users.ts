import supabaseClient from '@/lib/supabase/client';

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
}

export const workspaceUsersService = new WorkspaceUsersService();
