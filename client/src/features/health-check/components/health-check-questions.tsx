'use client';

import { Accordion } from '@/components/ui/accordion';
import { QuestionAccordionItem } from '@/features/health-check/components/question-accordion-item';
import {
  ActionItemWithAssignees,
  HealthCheck,
  Question,
  Response,
  Section,
  User,
} from '@/features/health-check/types/health-check';

interface HealthCheckQuestionsProps {
  responses: Response[];
  questions: Question[];
  allOpen: boolean;
  actionItems: ActionItemWithAssignees[];
  healthCheck: HealthCheck;
  teamMembers: User[];
  handleQuestionClick: (index: number) => void;
}

export const HealthCheckQuestions = ({
  responses,
  questions,
  allOpen,
  handleQuestionClick,
}: HealthCheckQuestionsProps) => {
  const visibleQuestions = questions.filter(
    (q) => q.section !== Section.AdditionalQuestions,
  );

  const openItems = allOpen ? visibleQuestions.map((q) => q.id) : [];

  return (
    <div>
      <Accordion
        type="multiple"
        value={openItems}
        className="animate-fade-in space-y-2"
      >
        {visibleQuestions.map((question, index) => (
          <QuestionAccordionItem
            key={question.id}
            question={question}
            responses={responses}
            handleQuestionClick={() => handleQuestionClick(index)}
          />
        ))}
      </Accordion>
    </div>
  );
};
