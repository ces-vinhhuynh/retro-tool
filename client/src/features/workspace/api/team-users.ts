import supabaseClient from '@/lib/supabase/client';
import { TeamUser, TeamUserInsert, TeamUserUpdate } from '@/types/team';

class TeamUsersService {
  async create(teamUser: TeamUserInsert): Promise<TeamUserInsert> {
    const { data, error } = await supabaseClient
      .from('team_users')
      .insert(teamUser)
      .single();

    if (error) throw error;
    return data;
  }

  async getTeamMember(teamId: string) {
    const { data, error } = await supabaseClient
      .from('team_users')
      .select(
        `
          id,
          role,
          users (
            id,
            full_name,
            avatar_url,
            email
          )
        `,
      )
      .eq('team_id', teamId);

    if (error) throw error;

    return data.map(({ id, role, users }) => ({
      id,
      role,
      full_name: users.full_name,
      avatar_url: users.avatar_url,
      email: users.email,
    }));
  }

  async update(id: string, teamUser: TeamUserUpdate): Promise<TeamUser> {
    const { data, error } = await supabaseClient
      .from('team_users')
      .update(teamUser)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from('team_users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const teamUsersService = new TeamUsersService();
