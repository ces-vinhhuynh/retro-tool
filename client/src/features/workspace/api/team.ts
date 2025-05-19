import supabaseClient from '@/lib/supabase/client';

import { Team } from '../types/team';

class TeamService {
  async getTeams(workspaceId: string): Promise<Team[]> {
    const { data, error } = await supabaseClient
      .from('teams')
      .select('*')
      .eq('workspace_id', workspaceId);
    if (error) throw error;
    return data ?? [];
  }

  async getByWorkspaceId(workspaceId: string) {
    const { data, error } = await supabaseClient
      .from('teams')
      .select(
        `
          id,
          name,
          team_users (
            role,
            users (
              id,
              full_name,
              avatar_url
            )
          )
        `,
      )
      .eq('workspace_id', workspaceId);

    if (error) throw error;

    return data.map(({ id, name, team_users }) => ({
      id,
      name,
      users: team_users.map((user) => ({
        id: user.users.id,
        full_name: user.users.full_name,
        avatar_url: user.users.avatar_url,
        role: user.role,
      })),
    }));
  }
}

export const teamService = new TeamService();
