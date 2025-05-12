import supabaseClient from '@/lib/supabase/client';

import { Response } from '../types/health-check';

class ResponseService {
  async getByHealthCheckId(healthCheckId: string): Promise<Response[]> {
    const { data, error } = await supabaseClient
      .from('responses')
      .select(
        `
            *,
            user:users (
              id,
              full_name,
              avatar_url,
              email
            )
          `,
      )
      .eq('health_check_id', healthCheckId);

    if (error) throw error;
    return data;
  }
}

export const responseService = new ResponseService();
