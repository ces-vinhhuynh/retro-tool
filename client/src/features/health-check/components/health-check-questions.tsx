'use client';

import { useMemo, useState } from 'react';

import { Accordion } from '@/components/ui/accordion';
import QuestionAccordionItem from '@/features/health-check/components/question-accordion-item';
import {
  Question,
  Response,
  Section,
} from '@/features/health-check/types/health-check';
import { getCommentsByQuestionId } from '@/features/health-check/utils/comment';
import { getRatings } from '@/features/health-check/utils/rating';

import ChartDialog from './chart-dialog';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const visibleQuestions = useMemo(
    () => questions.filter((q) => q.section !== Section.AdditionalQuestions),
    [questions],
  );

  const openItems = useMemo(
    () => (allOpen ? visibleQuestions.map((q) => q.id) : []),
    [allOpen, visibleQuestions],
  );

  const chartData = useMemo(
    () =>
      visibleQuestions.map((question) => {
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
      }),
    [visibleQuestions, responses],
  );

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
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          data={chartData}
          currentIndex={selectedIndex}
          setCurrentIndex={setSelectedIndex}
        />
      )}
    </div>
  );
}
