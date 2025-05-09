import { Tables } from '@/types/database';

export type HealthCheck = Tables<'health_checks'>;
export type Response = Tables<'responses'>;
export type ActionItem = Tables<'action_items'>;

export type HealthCheckTemplate = Omit<
  Tables<'health_check_templates'>,
  'min_value' | 'max_value'
> & {
  min_value: Score;
  max_value: Score;
};

export type GroupedQuestions = {
  [section: string]: Question[];
};

export type HealthCheckWithTemplate = HealthCheck & {
  template: HealthCheckTemplate & {
    questions: Question[];
  };
};

export type Score = {
  value: number;
  context: string;
};

export type AverageScores = {
  [questionId: string]: {
    average_score: number;
  };
};

export type Question = {
  id: string;
  title: string;
  section: string;
  description: string;
};

export type Answer = {
  [questionId: string]: {
    length: number;
    rating: number;
    comment: string[];
    vote: number;
    created_at: string;
    updated_at: string;
  };
};

export enum HealthCheckStatus {
  IN_PROGRESS = 'in progress',
  DONE = 'done',
}

export enum Section {
  DeliveryExecution = 'Delivery & Execution',
  TeamCollaboration = 'Team Collaboration',
  AdditionalQuestions = 'Additional Questions',
}

export enum ActionStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  BLOCKED = 'blocked',
}

export enum ActionPriority {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
