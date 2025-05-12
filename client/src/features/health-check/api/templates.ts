import supabaseClient from '@/lib/supabase/client';
import { Template } from '@/lib/types';

import { QuestionData, TemplateResponse } from '../types/templates';

class TemplateService {
  async getAll(): Promise<Template[]> {
    const { data, error } = await supabaseClient
      .from('health_check_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as TemplateResponse[]).map((template) => {
      // Parse the questions JSON if it's a string
      const questions = typeof template.questions === 'string'
        ? JSON.parse(template.questions)
        : template.questions;

      return {
        id: template.id,
        name: template.name,
        description: template.description ?? '',
        questions: (questions as QuestionData[]).map((q) => ({
          id: q.id,
          title: q.title,
          text: q.text,
          section: q.section,
          description: q.description,
          type: q.type as 'scale' | 'text' | 'choice',
          options: q.options,
        })),
      };
    });
  }

  async getById(id: string): Promise<Template | null> {
    const { data, error } = await supabaseClient
      .from('health_check_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    if (!data) return null;

    const template = data as TemplateResponse;

    // Parse the questions JSON if it's a string
    const questions = typeof template.questions === 'string'
      ? JSON.parse(template.questions)
      : template.questions;

    return {
      id: template.id,
      name: template.name,
      description: template.description ?? '',
      questions: (questions as QuestionData[]).filter(
        (q): q is QuestionData =>
          !!q.title && !!q.text && !!q.section && !!q.description && !!q.type && !!q.options
      ).map((q) => ({
        id: q.id,
        title: q.title,
        text: q.text,
        section: q.section,
        description: q.description,
        type: q.type as 'scale' | 'text' | 'choice',
        options: q.options,
      })),
    };
  }
}

export const templateService = new TemplateService();
