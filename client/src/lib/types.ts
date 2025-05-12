export interface Question {
  title: string;
  description: string;
  type: 'scale' | 'text' | 'choice';
  options?: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}
