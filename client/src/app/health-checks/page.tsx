'use client';

import SurveyTab from '@/features/health-check/components/survey-tab';
import { useHealthCheckTemplates } from '@/features/health-check/hooks/use-health-check-templates';
import { Question } from '@/features/health-check/types/health-check';

export type GroupedQuestions = {
  [section: string]: Question[];
};

export default function HealthCheckPage() {
  const { data: template, isLoading } = useHealthCheckTemplates(
    'e53df2fb-b6dc-4c4d-92de-91b157216a12',
  );

  const questions: Question[] = (template?.questions as Question[]) || [];
  const grouped = questions.reduce<GroupedQuestions>((acc, question) => {
    const { section } = question;

    if (!acc[section]) {
      acc[section] = [];
    }

    acc[section].push(question);

    return acc;
  }, {});

  const sections = Object.keys(grouped);
  const groupedQuestions = grouped;

  if (isLoading || !template) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <SurveyTab
        sections={sections}
        groupedQuestions={groupedQuestions}
        minScore={template.min_value}
        maxScore={template.max_value}
      />
    </div>
  );
}
