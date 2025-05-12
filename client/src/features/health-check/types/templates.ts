export type TemplateResponse = {
  id: string;
  name: string;
  description: string | null;
  questions: unknown;
  min_value: number;
  max_value: number;
};

export interface QuestionData {
  id: string;
  title: string;
  text: string;
  section: string;
  description: string;
  type: string;
  options: string[];
}
