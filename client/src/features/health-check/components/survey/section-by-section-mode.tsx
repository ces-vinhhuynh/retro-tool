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

interface SectionBySectionModeProps {
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
  currentGroupIndex: number;
}

export const SectionBySectionMode = ({
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
  allowParticipantNavigation,
  isFacilitator,
  handleNavigation,
  currentGroupIndex,
}: SectionBySectionModeProps) => {
  const currentSection = sections[currentGroupIndex];
  const questions = groupedQuestions?.[currentSection] || [];

  return (
    <div>
      <SectionWrapper title={currentSection}>
        {questions.map((question: Question) =>
          currentSection === Section.AdditionalQuestions ? (
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

      <SurveyNavigation
        allowParticipantNavigation={allowParticipantNavigation}
        isFacilitator={isFacilitator}
        handleNavigation={handleNavigation}
        length={sections.length}
        index={currentGroupIndex}
      />
    </div>
  );
};
