import { Tables, TablesInsert, TablesUpdate } from '@/types/database';
import { Team } from '@/types/team';

export type HealthCheckTemplate = Omit<
  Tables<'health_check_templates'>,
  'min_value' | 'max_value'
> & {
  min_value: Score;
  max_value: Score;
};
export type HealthCheckInsert = TablesInsert<'health_checks'>;
export type HealthCheckUpdate = TablesUpdate<'health_checks'>;
export type HealthCheck = Tables<'health_checks'>;
export type HealthCheckWithTeam = HealthCheck & {
  team: Team;
};

export type Response = Tables<'responses'>;
export type ResponseInsert = TablesInsert<'responses'>;
export type ResponseUpdate = TablesUpdate<'responses'>;
export type User = Tables<'users'>;
export type ResponseWithUser = Omit<Response, 'user'> & {
  user: User;
};

export type Participant = Tables<'participants'>;
export type ParticipantWithUser = Omit<Participant, 'user'> & {
  user: User;
};

export type Score = {
  value: number;
  context: string;
};

export type GroupedQuestions = Record<string, Question[]>;
export type ActionItem = Tables<'action_items'>;
export type ActionItemAssignee = Tables<'action_item_assignees'>;
export type ActionItemWithAssignees = ActionItem & {
  action_item_assignees: ActionItemAssignee[];
};

export type HealthCheckWithTemplate = HealthCheck & {
  template: HealthCheckTemplate & {
    questions: Question[];
  };
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

export type QuestionAnswer = {
  rating: number | null;
  comment: string[];
  vote: number;
  created_at: string;
  updated_at: string;
};

export type Answers = {
  [questionId: string]: QuestionAnswer;
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
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export type Challenge = {
  text: string;
  response: Response;
  additionalQuestionId: string;
};

export type FormattedHealthCheck = {
  id: string;
  title: string;
  createdAt: string | null;
  status: 'in progress' | 'done' | null;
  questions: {
    id: string;
    title: string;
    description: string;
    averageScore: number;
  }[];
};

export enum DisplayMode {
  SINGLE = 'single',
  GROUPED = 'grouped',
  ALL = 'all',
}

export type HealthCheckFormData = {
  title: string;
  dueDate: Date;
  displayMode: DisplayMode;
};

export type HealthCheckSettings = {
  display_mode: DisplayMode;
};
