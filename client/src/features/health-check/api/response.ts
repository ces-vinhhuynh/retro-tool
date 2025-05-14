import supabaseClient from '@/lib/supabase/client';

import { Response, ResponseInsert, Answers } from '../types/health-check';

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

  async getByHealthCheckIdAndUserId(
    healthCheckId: string,
    userId: string,
  ): Promise<Response> {
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
      .eq('health_check_id', healthCheckId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(responseItem: ResponseInsert): Promise<ResponseInsert> {
    const { data, error } = await supabaseClient
      .from('responses')
      .insert(responseItem)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(
    id: string,
    questionId: string,
    answer: { rating?: number | null; comment?: string[]; vote?: number },
  ): Promise<Response> {
    const { data: currentResponse, error: fetchError } = await supabaseClient
      .from('responses')
      .select('answers')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const currentAnswers = (currentResponse?.answers as Partial<Answers>) || {};
    const currentQuestionAnswer = currentAnswers[questionId] || {};

    const updatedQuestionAnswer = {
      ...currentQuestionAnswer,
      ...answer,
    };

    const updatedAnswers = {
      ...currentAnswers,
      [questionId]: updatedQuestionAnswer,
    };

    const { data, error } = await supabaseClient
      .from('responses')
      .update({ answers: updatedAnswers })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
}

export const responseService = new ResponseService();
