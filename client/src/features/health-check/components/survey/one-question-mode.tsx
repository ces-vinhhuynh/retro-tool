'use client';

import {
  AnswerSurvey,
  GroupedQuestions,
  Question,
  Score,
  Section,
} from '../../types/health-check';
import { AdditionalQuestion } from '../additional-question';
import { SectionWrapper } from '../section-wrapper';
import { SurveyQuestionRow } from '../survey-question-row';

import { SurveyNavigation } from './survey-navigation';

interface OneQuestionModeProps {
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
  allowParticipantNavigation: boolean;
  isFacilitator: boolean;
  handleNavigation: (index: number) => void;
  currentQuestionIndex: number;
  questions: Question[];
}

export const OneQuestionMode = ({
  minScore,
  maxScore,
  answers,
  onResponseChange,
  onCommentChange,
  handleAddAdditionalComment,
  handleChangeAdditionalComment,
  handleDeleteAdditionalComment,
  allowParticipantNavigation,
  isFacilitator,
  handleNavigation,
  currentQuestionIndex,
  questions,
}: OneQuestionModeProps) => {
  const currentQuestion = questions[currentQuestionIndex];
  const isAdditionalQuestion =
    questions[currentQuestionIndex].section === Section.AdditionalQuestions;

  if (!currentQuestion) return <></>;

  return (
    <>
      <SectionWrapper title={currentQuestion.section}>
        {isAdditionalQuestion ? (
          <AdditionalQuestion
            id={currentQuestion.id}
            title={currentQuestion.title}
            description={currentQuestion.description}
            answers={answers.comments[currentQuestion.id] || ''}
            handleAddAnswer={handleAddAdditionalComment}
            handleChangeAnswer={handleChangeAdditionalComment}
            handleDeleteAnswer={handleDeleteAdditionalComment}
          />
        ) : (
          <SurveyQuestionRow
            key={currentQuestion.id}
            question={{
              id: currentQuestion.id,
              text: currentQuestion.title,
              description: currentQuestion.description,
              required: true,
            }}
            value={answers.responses[currentQuestion.id]}
            comment={answers.comments[currentQuestion.id] || ''}
            onValueChange={(val) => onResponseChange(currentQuestion.id, val)}
            onCommentChange={(val) => onCommentChange(currentQuestion.id, val)}
            minScore={minScore}
            maxScore={maxScore}
          />
        )}
      </SectionWrapper>

      <SurveyNavigation
        allowParticipantNavigation={allowParticipantNavigation}
        isFacilitator={isFacilitator}
        handleNavigation={handleNavigation}
        length={questions.length}
        index={currentQuestionIndex}
      />
    </>
  );
};
