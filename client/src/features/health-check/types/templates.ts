import { Tables, TablesInsert, TablesUpdate } from '@/types/database';

import { Section } from './health-check';

export type TemplateInsert = TablesInsert<'health_check_templates'>;
export type TemplateUpdate = TablesUpdate<'health_check_templates'>;
export type Template = Tables<'health_check_templates'>;

export interface Question {
  id: string;
  title: string;
  description: string;
  section: Section;
  type: 'scale' | 'text' | 'choice';
  options?: string[];
}
