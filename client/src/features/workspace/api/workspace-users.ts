import supabaseClient from '@/lib/supabase/client';

import {
  WorkspaceUser,
  WorkspaceUserInsert,
  WorkspaceUserUpdate,
} from '../types/workspace-users';

import { teamService } from './team';

class WorkspaceUsersService {
  async getWorkspaces(userId: string) {
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
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async create(workspaceUser: WorkspaceUserInsert): Promise<WorkspaceUser> {
    const { data, error } = await supabaseClient
      .from('workspace_users')
      .insert(workspaceUser)
      .single();

    if (error) throw error;
    return data;
  }

  async update(
    id: string,
    workspaceUser: WorkspaceUserUpdate,
  ): Promise<WorkspaceUser> {
    const { data, error } = await supabaseClient
      .from('workspace_users')
      .update(workspaceUser)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async getWorkspaceUsersByWorkspaceId(workspaceId: string) {
    const { data, error } = await supabaseClient
      .from('workspace_users')
      .select(
        `
          id,
          role,
          users (
            id,
            full_name,
            avatar_url,
            email,
            team_users (
              teams (
                name,
                workspace_id
              )
            )
          )
        `,
      )
      .eq('workspace_id', workspaceId)
      .eq('status', 'accepted');

    if (error) throw error;

    return data.map(({ id, role, users }) => ({
      id,
      role,
      full_name: users?.full_name,
      avatar_url: users?.avatar_url,
      email: users?.email,
      teams: users?.team_users
        .filter((tu) => tu.teams?.workspace_id === workspaceId)
        .map((tu) => tu.teams?.name),
    }));
  }

  async getByWorkspaceIdAndUserId(workspaceId: string, userId: string) {
    const { data, error } = await supabaseClient
      .from('workspace_users')
      .select(`*`)
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return data;
  }

  async delete(id: string): Promise<void> {
    const { data: deletedUser, error } = await supabaseClient
      .from('workspace_users')
      .delete()
      .eq('id', id)
      .select('user_id, workspace_id')
      .single();

    const teams = await teamService.getByWorkspaceIdAndUserId(
      deletedUser?.workspace_id || '',
      deletedUser?.user_id || '',
    );

    for (const team of teams) {
      const { error: errorTeamUsers } = await supabaseClient
        .from('team_users')
        .delete()
        .eq('team_id', team.id)
        .eq('user_id', deletedUser?.user_id || '');

      if (errorTeamUsers) throw errorTeamUsers;
    }

    if (error) throw error;
  }

  async inviteUserToWorkspace(email: string, workspaceId: string) {
    return await supabaseClient.functions.invoke('invite-user-to-workspace', {
      body: { email, workspace_id: workspaceId },
    });
  }

  async getWorkspaceUserByToken(token: string) {
    const { data, error } = await supabaseClient
      .from('workspace_users')
      .select('*, workspaces(*)')
      .eq('token', token)
      .single();

    if (error) throw error;
    return data;
  }

  async getWorkspaceUserByEmailAndWorkspaceId(
    email: string,
    workspaceId: string,
  ) {
    const { data, error } = await supabaseClient
      .from('workspace_users')
      .select('*')
      .eq('email', email)
      .eq('workspace_id', workspaceId)
      .single();

    if (error) throw error;
    return data;
  }
}

export const workspaceUsersService = new WorkspaceUsersService();
