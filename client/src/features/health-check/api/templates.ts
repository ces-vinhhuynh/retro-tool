import supabaseClient from '@/lib/supabase/client';

import { Question, Template } from '../types/templates';

class TemplateService {
  async getAll(): Promise<Template[]> {
    const { data, error } = await supabaseClient
      .from('health_check_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as unknown as Template[]).map((template) => {
      // Parse the questions JSON if it's a string
      const questions =
        typeof template.questions === 'string'
          ? JSON.parse(template.questions)
          : template.questions;

      return {
        id: template.id,
        name: template.name,
        description: template.description ?? '',
        questions: (questions as Question[]).map((q) => ({
          id: q.id,
          title: q.title,
          section: q.section,
          description: q.description,
          type: q.type,
          options: q.options,
        })),
        min_value: template.min_value,
        max_value: template.max_value,
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

    const template = data as unknown as Template;

    // Parse the questions JSON if it's a string
    const questions =
      typeof template.questions === 'string'
        ? JSON.parse(template.questions)
        : template.questions;

    return {
      id: template.id,
      name: template.name,
      description: template.description ?? '',
      questions: (questions as Question[]).map((q) => ({
        id: q.id,
        title: q.title,
        section: q.section,
        description: q.description,
        type: q.type,
        options: q.options,
      })),
      min_value: template.min_value,
      max_value: template.max_value,
    };
  }
}

export const templateService = new TemplateService();
