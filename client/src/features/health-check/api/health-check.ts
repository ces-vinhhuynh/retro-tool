import {
  HealthCheck,
  HealthCheckTemplate,
  Score,
} from '@/features/health-check/types/health-check';
import supabaseClient from '@/lib/supabase/client';

export const healthCheckService = {
  getHealthCheckTemplatesById: async (
    id: string,
  ): Promise<HealthCheckTemplate | null> => {
    const { data, error } = await supabaseClient
      .from('health_check_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(
        `Failed to fetch health check template: ${error.message}`,
      );
    }

    if (!data) return null;

    return {
      ...data,
      min_value: data.min_value as Score,
      max_value: data.max_value as Score,
    };
  },

  async getById(id: string): Promise<HealthCheck> {
    const { data, error } = await supabaseClient
      .from('health_checks')
      .select(
        `
        *,
        template:health_check_templates (
          id,
          name,
          description,
          questions
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
};
