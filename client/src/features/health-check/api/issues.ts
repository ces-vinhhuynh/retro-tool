import supabaseClient from '@/lib/supabase/client';

import { IssueInsert } from '../types/issues';

class IssuesService {
  async create(issue: IssueInsert) {
    const { data, error } = await supabaseClient.from('issues').insert([
      {
        health_check_id: issue.health_check_id,
        team_id: issue.team_id,
        title: issue.title,
        description: issue.description,
      },
    ]);

    if (error) {
      throw new Error(`Error adding issue: ${error.message}`);
    }

    return data;
  }

  async getByTeamId(teamId: string) {
    const { data, error } = await supabaseClient
      .from('issues')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching issues: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient.from('issues').delete().eq('id', id);

    if (error) {
      throw new Error(`Error deleting issue: ${error.message}`);
    }
  }
}

export const issuesService = new IssuesService();
