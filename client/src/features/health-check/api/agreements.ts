import supabaseClient from '@/lib/supabase/client';

import { Agreement, AgreementInsert } from '../types/agreements';

class AgreementsService {
  async create(agreement: AgreementInsert) {
    const { data, error } = await supabaseClient
      .from('agreements')
      .insert(agreement);

    if (error) {
      throw new Error(`Error adding agreement: ${error.message}`);
    }

    return data;
  }

  async getByTeamId(teamId: string): Promise<Agreement[]> {
    const { data, error } = await supabaseClient
      .from('agreements')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching agreements: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from('agreements')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting agreement: ${error.message}`);
    }
  }
}

export const agreementsService = new AgreementsService();
