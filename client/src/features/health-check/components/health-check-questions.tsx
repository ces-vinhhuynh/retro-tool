'use client';

import { Accordion } from '@/components/ui/accordion';
import QuestionAccordionItem from '@/features/health-check/components/question-accordion-item';
import {
  Question,
  Response,
  Section,
} from '@/features/health-check/types/health-check';

interface HealthCheckQuestionsProps {
  responses: Response[];
  questions: Question[];
  allOpen: boolean;
}

export default function HealthCheckQuestions({
  responses,
  questions,
  allOpen,
}: HealthCheckQuestionsProps) {
  const openItems = allOpen ? questions.map((question) => question.id) : [];

  return (
    <Accordion
      type="multiple"
      value={openItems}
      className="animate-fade-in space-y-2 pt-6"
    >
      {questions
        .filter((q) => q.section !== Section.AdditionalQuestions)
        .map((question) => (
          <QuestionAccordionItem
            key={question.id}
            question={question}
            responses={responses}
          />
        ))}
    </Accordion>
  );
}
