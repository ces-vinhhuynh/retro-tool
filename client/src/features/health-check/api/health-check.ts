import {
  HealthCheck,
  HealthCheckInsert,
  HealthCheckUpdate,
} from '@/features/health-check/types/health-check';
import supabaseClient from '@/lib/supabase/client';

import { HEALTH_CHECK_LIMIT } from '../utils/constants';

class HealthCheckService {
  async getWithTemplateById(id: string): Promise<HealthCheck> {
    const { data, error } = await supabaseClient
      .from('health_checks')
      .select(
        `
        *,
        template:health_check_templates (
          id,
          name,
          description,
          questions,
          deleted_at
        ),
        team:teams (
          id,
          name,
          workspace_id
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Health Checks
  async create(healthCheck: HealthCheckInsert): Promise<HealthCheck> {
    const { data, error } = await supabaseClient
      .from('health_checks')
      .insert(healthCheck)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async getHealthChecks(): Promise<HealthCheck[]> {
    const { data, error } = await supabaseClient
      .from('health_checks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getHealthCheck(id: string): Promise<HealthCheck | null> {
    const { data, error } = await supabaseClient
      .from('health_checks')
      .select(
        `
        *,
        team:teams (
          id,
          name,
          workspace_id
        )
      `,
      )
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async update(
    id: string,
    healthCheck: HealthCheckUpdate,
  ): Promise<HealthCheck> {
    const { data, error } = await supabaseClient
      .from('health_checks')
      .update(healthCheck)
      .eq('id', id)
      .select(
        `
      *,
      template:health_check_templates (
        id,
        name,
        description,
        questions,
        deleted_at
      ),
      team:teams (
        id,
        name,
        workspace_id
      )
    `,
      )
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from('health_checks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getByTemplateIdAndTeamId(
    templateId: string,
    teamId: string,
  ): Promise<HealthCheck[]> {
    const { data, error } = await supabaseClient
      .from('health_checks')
      .select(
        `
        *,
        template:health_check_templates (
          id,
          name,
          description,
          questions,
          deleted_at
        )
      `,
      )
      .eq('template_id', templateId)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .limit(HEALTH_CHECK_LIMIT);

    if (error) throw error;
    return data || [];
  }

  async getByTeamId(teamId: string): Promise<HealthCheck[]> {
    const { data, error } = await supabaseClient
      .from('health_checks')
      .select(
        `
        *,
        template:health_check_templates (
          id,
          name,
          description,
          questions,
          deleted_at
        )
      `,
      )
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateFacilitators(
    id: string,
    facilitatorIds: string[],
  ): Promise<HealthCheck> {
    const { data, error } = await supabaseClient
      .from('health_checks')
      .update({ facilitator_ids: facilitatorIds })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;

    return data;
  }

  async updateAverageScores(healthCheckId: string) {
    return await supabaseClient.functions.invoke('update-average-scores', {
      body: { healthCheckId },
    });
  }
}

export const healthCheckService = new HealthCheckService();
