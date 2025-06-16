'use client';

import SurveyQuestionRow from '@/features/health-check/components/survey-question-row';
import {
  AnswerSurvey,
  GroupedQuestions,
  Question,
  Score,
  Section,
} from '@/features/health-check/types/health-check';

import AdditionalQuestion from '../additional-question';
import { SectionWrapper } from '../section-wrapper';

interface AllQuestionModeProps {
  sections: string[];
  groupedQuestions: GroupedQuestions;
  minScore: Score;
  maxScore: Score;
  answers: AnswerSurvey;
  onResponseChange: (questionId: string, value: number) => void;
  onCommentChange: (questionId: string, value: string[]) => void;
  handleAddAdditionalComment: (questionId: string, newComment: string) => void;
  handleChangeAdditionalComment: (
    questionId: string,
    index: number,
    value: string,
  ) => void;
  handleDeleteAdditionalComment: (questionId: string, index: number) => void;
}

export default function AllQuestionMode({
  sections,
  groupedQuestions,
  minScore,
  maxScore,
  answers,
  onResponseChange,
  onCommentChange,
  handleAddAdditionalComment,
  handleChangeAdditionalComment,
  handleDeleteAdditionalComment,
}: AllQuestionModeProps) {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      {sections.map((section) => (
        <SectionWrapper key={section} title={section}>
          {(groupedQuestions[section] || []).map((question: Question) =>
            section === Section.AdditionalQuestions ? (
              <AdditionalQuestion
                key={question.id}
                id={question.id}
                title={question.title}
                description={question.description}
                answers={answers.comments[question.id] || ''}
                handleAddAnswer={handleAddAdditionalComment}
                handleChangeAnswer={handleChangeAdditionalComment}
                handleDeleteAnswer={handleDeleteAdditionalComment}
              />
            ) : (
              <SurveyQuestionRow
                key={question.id}
                question={{
                  id: question.id,
                  text: question.title,
                  description: question.description,
                  required: true,
                }}
                value={answers.responses[question.id]}
                comment={answers.comments[question.id] || ''}
                onValueChange={(val) => onResponseChange(question.id, val)}
                onCommentChange={(val) => onCommentChange(question.id, val)}
                minScore={minScore}
                maxScore={maxScore}
              />
            ),
          )}
        </SectionWrapper>
      ))}
    </div>
  );
}
