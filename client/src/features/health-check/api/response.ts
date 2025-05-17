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

  async moveTagAdditionalAnswer({
    responseId,
    additionalQuestionId,
    questionId,
    commentText,
    commentIndex,
  }: {
    responseId: string;
    additionalQuestionId: string;
    questionId: string;
    commentText: string;
    commentIndex: number;
  }): Promise<Response> {
    const { data: currentResponse, error: fetchError } = await supabaseClient
      .from('responses')
      .select('answers')
      .eq('id', responseId)
      .single();

    if (fetchError) throw fetchError;

    const currentAnswers = (currentResponse?.answers as Partial<Answers>) || {};
    const fromComments = currentAnswers[additionalQuestionId]?.comment ?? [];
    const toComments = currentAnswers[questionId]?.comment ?? [];

    // Remove specific comment by index
    const updatedFromComments = [
      ...fromComments.slice(0, commentIndex),
      ...fromComments.slice(commentIndex + 1),
    ];

    // Add to target if not exists
    const updatedToComments = toComments.includes(commentText)
      ? toComments
      : [...toComments, commentText];

    const updatedAnswers = {
      ...currentAnswers,
      [additionalQuestionId]: {
        ...currentAnswers[additionalQuestionId],
        comment: updatedFromComments,
      },
      [questionId]: {
        ...currentAnswers[questionId],
        comment: updatedToComments,
      },
    };

    const { data, error } = await supabaseClient
      .from('responses')
      .update({ answers: updatedAnswers })
      .eq('id', responseId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async getAllByHealthChecks(healthCheckIds: string[]): Promise<Response[]> {
    const { data, error } = await supabaseClient
      .from('responses')
      .select('*')
      .in('health_check_id', healthCheckIds);

    if (error) throw error;
    return data;
  }
}

export const responseService = new ResponseService();
