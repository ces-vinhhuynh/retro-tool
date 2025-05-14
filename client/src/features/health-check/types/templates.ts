export type Template = {
  id: string;
  name: string;
  description: string | null;
  questions: Question[];
  min_value: { value: number; context: string };
  max_value: { value: number; context: string };
};

export interface Question {
  id: string;
  title: string;
  description: string;
  section: string;
  type: 'scale' | 'text' | 'choice';
  options?: string[];
}
