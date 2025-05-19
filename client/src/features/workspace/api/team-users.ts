import supabaseClient from '@/lib/supabase/client';

class TeamUsersService {
  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from('team_users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const teamUsersService = new TeamUsersService();
