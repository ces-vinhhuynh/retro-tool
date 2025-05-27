'use client';

import { useState } from 'react';

import { Accordion } from '@/components/ui/accordion';
import ChartDialog from '@/features/health-check/components/chart-dialog';
import QuestionAccordionItem from '@/features/health-check/components/question-accordion-item';
import {
  ActionItemWithAssignees,
  HealthCheck,
  Question,
  Response,
  Section,
  User,
} from '@/features/health-check/types/health-check';
import { getCommentsByQuestionId } from '@/features/health-check/utils/comment';
import { getRatings } from '@/features/health-check/utils/rating';

interface HealthCheckQuestionsProps {
  responses: Response[];
  questions: Question[];
  allOpen: boolean;
  actionItems: ActionItemWithAssignees[];
  healthCheck: HealthCheck;
  teamMembers: User[];
}

const HealthCheckQuestions = ({
  responses,
  questions,
  allOpen,
  actionItems,
  healthCheck,
  teamMembers,
}: HealthCheckQuestionsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const visibleQuestions = questions.filter(
    (q) => q.section !== Section.AdditionalQuestions,
  );

  const openItems = allOpen ? visibleQuestions.map((q) => q.id) : [];

  const chartData = visibleQuestions.map((question) => {
    const ratings = getRatings(responses, question.id);
    const comments = getCommentsByQuestionId(responses, question.id);
    const total = ratings.reduce((sum, r) => sum + r.count, 0);
    const avgScore = total
      ? ratings.reduce((sum, r) => sum + r.score * r.count, 0) / total
      : 0;

    return {
      id: question.id,
      subject: question.title,
      value: avgScore,
      fullTitle: question.title,
      description: question.description,
      comments: comments.map((c) => ({
        comment: c.comment,
        created_at: c.created_at || new Date().toISOString(),
      })),
    };
  });

  const handleQuestionClick = (index: number) => {
    setSelectedIndex(index);
    setDialogOpen(true);
  };

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
      {dialogOpen && (
        <ChartDialog
          teamMembers={teamMembers}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          data={chartData}
          currentIndex={selectedIndex}
          setCurrentIndex={setSelectedIndex}
          healthCheck={healthCheck}
          actionItems={actionItems}
        />
      )}
    </div>
  );
};

export default HealthCheckQuestions;
