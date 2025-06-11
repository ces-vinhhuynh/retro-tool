import supabaseClient from '@/lib/supabase/client';

import { Answers } from '../types/health-check';
import {
  Question,
  Template,
  TemplateInsert,
  TemplateUpdate,
} from '../types/templates';

import { healthCheckService } from './health-check';
import { responseService } from './response';

class TemplateService {
  async getAll(): Promise<Template[]> {
    const { data, error } = await supabaseClient
      .from('health_check_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as Template[]).map((template) => {
      // Parse the questions JSON if it's a string
      const questions =
        typeof template.questions === 'string'
          ? JSON.parse(template.questions)
          : template.questions;

      return {
        ...template,
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
      .select('*, health_checks(*)')
      .eq('id', id)
      .single();

    if (error) return null;
    if (!data) return null;

    const template = data as Template;

    // Parse the questions JSON if it's a string
    const questions =
      typeof template.questions === 'string'
        ? JSON.parse(template.questions)
        : template.questions;

    return {
      ...template,
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

  async getByTeamId(teamId: string): Promise<Template[]> {
    const { data, error } = await supabaseClient
      .from('health_check_templates')
      .select('*')
      .eq('team_id', teamId)
      .is('deleted_at', null);

    if (error) throw error;

    const templates = data as Template[];

    return templates.map((template) => {
      const questions =
        typeof template.questions === 'string'
          ? JSON.parse(template.questions)
          : template.questions;

      return {
        ...template,
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

  async create(template: TemplateInsert): Promise<Template> {
    const { data, error } = await supabaseClient
      .from('health_check_templates')
      .insert(template)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async updateCustomTemplate(
    id: string,
    templateUpdate: TemplateUpdate,
  ): Promise<Template> {
    const existingTemplate = await this.getById(id);
    if (!existingTemplate) throw new Error('Template not found');

    if (!existingTemplate?.is_custom) {
      throw new Error('Cannot update standard template');
    }

    const { data: updatedTemplate, error } = await supabaseClient
      .from('health_check_templates')
      .update(templateUpdate)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    // Get all health checks using this template
    const healthChecks = existingTemplate.health_checks;

    if (!healthChecks || healthChecks.length === 0) {
      return updatedTemplate;
    }

    // Update the average scores for the health checks that use this template
    for (const healthCheck of healthChecks) {
      await healthCheckService.updateAverageScores(healthCheck.id);
    }

    // Get the existing question IDs before update
    const existingQuestions =
      typeof existingTemplate.questions === 'string'
        ? JSON.parse(existingTemplate.questions)
        : existingTemplate.questions;

    const existingQuestionIds =
      (existingQuestions as Question[])?.map((q) => q.id) || [];

    // Get the new question IDs from the update
    const updatedQuestions =
      typeof templateUpdate.questions === 'string'
        ? JSON.parse(templateUpdate.questions)
        : templateUpdate.questions;

    const updatedQuestionIds =
      (updatedQuestions as Question[])?.map((q) => q.id) || [];

    // Find question IDs that were removed
    const removedQuestionIds = existingQuestionIds.filter(
      (id) => !updatedQuestionIds.includes(id),
    );

    if (removedQuestionIds.length === 0) {
      return updatedTemplate;
    }

    // Set question_id to null for action items referencing removed questions
    const { error: updateActionItemsError } = await supabaseClient
      .from('action_items')
      .update({ question_id: null })
      .in('question_id', removedQuestionIds);

    if (updateActionItemsError) {
      throw updateActionItemsError;
    }

    const healthCheckIds = healthChecks.map((hc) => hc.id);

    // Get all responses for these health checks
    const responses =
      await responseService.getAllByHealthChecks(healthCheckIds);

    // Update each response to remove answers for deleted questions
    for (const response of responses || []) {
      const updatedAnswers = {
        ...(response.answers as Answers),
      };

      removedQuestionIds.forEach((questionId) => {
        delete updatedAnswers[questionId];
      });

      await responseService.updateResponseAnswers(response.id, updatedAnswers);
    }

    return updatedTemplate;
  }

  async deleteCustomTemplate(id: string): Promise<Template> {
    const existingTemplate = await this.getById(id);
    if (!existingTemplate) throw new Error('Template not found');

    if (!existingTemplate?.is_custom) {
      throw new Error('Cannot delete standard template');
    }

    const { data, error } = await supabaseClient
      .from('health_check_templates')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
}

export const templateService = new TemplateService();
