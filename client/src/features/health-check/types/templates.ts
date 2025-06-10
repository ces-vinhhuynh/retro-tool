import { Tables, TablesInsert, TablesUpdate } from '@/types/database';

import { Section } from './health-check';

export type TemplateInsert = TablesInsert<'health_check_templates'>;
export type TemplateUpdate = Pick<
  TablesUpdate<'health_check_templates'>,
  'name' | 'description' | 'questions'
>;
export type Template = Tables<'health_check_templates'> & {
  health_checks?: Tables<'health_checks'>[];
};

export interface Question {
  id: string;
  title: string;
  description: string;
  section: Section;
  type: 'scale' | 'text' | 'choice';
  options?: string[];
}
