import supabaseClient from '@/lib/supabase/client';

import { Workspace } from '../types/workspace';

class WorkspaceService {
  async create(workspace: Workspace): Promise<Workspace> {
    const { data, error } = await supabaseClient
      .from('workspaces')
      .insert(workspace)
      .single();

    if (error) throw error;
    return data;
  }

  async createWorkspaceAndTeam(
    workspaceId: string,
    workspaceName: string,
    teamId: string,
    teamName: string,
  ): Promise<void> {
    const { data, error } = await supabaseClient.rpc(
      'create_workspace_and_team',
      {
        ws_id: workspaceId,
        ws_name: workspaceName,
        team_id: teamId,
        team_name: teamName,
      },
    );

    if (error) throw error;
    return data;
  }
}

export const workspaceService = new WorkspaceService();
