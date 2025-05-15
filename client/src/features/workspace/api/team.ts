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
}

export const teamService = new TeamService();
