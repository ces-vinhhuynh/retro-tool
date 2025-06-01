'use client';

import {
  AnswerSurvey,
  GroupedQuestions,
  Question,
  Score,
} from '../../types/health-check';
import AdditionalQuestion from '../additional-question';
import SurveyQuestionRow from '../survey-question-row';

import { SurveyNavigation } from './survey-navigation';

interface SectionBySectionModeProps {
  sections: string[];
  groupedQuestions: GroupedQuestions;
  minScore: Score;
  maxScore: Score;
  answers: AnswerSurvey;
  onResponseChange: (questionId: string, value: number) => void;
  onCommentChange: (questionId: string, value: string[]) => void;
  additionalTitle: string;
  additionalDescription: string;
  additionalItems: string[];
  newItem: string;
  handleAdditionalItem: () => void;
  setNewItem: (item: string) => void;
  handleItemChange: (index: number, value: string) => void;
  handleDeleteItem: (index: number) => void;
  allowParticipantNavigation: boolean;
  isFacilitator: boolean;
  handleNavigation: (index: number) => void;
  currentGroupIndex: number;
}

const SectionBySectionMode = ({
  sections,
  groupedQuestions,
  minScore,
  maxScore,
  answers,
  onResponseChange,
  onCommentChange,
  additionalTitle,
  additionalDescription,
  additionalItems,
  newItem,
  handleAdditionalItem,
  setNewItem,
  handleItemChange,
  handleDeleteItem,
  allowParticipantNavigation,
  isFacilitator,
  handleNavigation,
  currentGroupIndex,
}: SectionBySectionModeProps) => {
  const regularSections = sections.filter(
    (section: string) => section !== 'Additional Questions',
  );

  const currentSection = regularSections[currentGroupIndex];
  const isAdditionalQuestion = currentGroupIndex >= regularSections.length;
  const questions = currentSection
    ? groupedQuestions[currentSection] || []
    : [];

  return (
    <div>
      {isAdditionalQuestion ? (
        <AdditionalQuestion
          title={additionalTitle}
          description={additionalDescription}
          answers={additionalItems}
          newAnswer={newItem}
          handleAddAnswer={handleAdditionalItem}
          setNewAnswer={setNewItem}
          handleAnswerChange={handleItemChange}
          handleDeleteAnswer={handleDeleteItem}
        />
      ) : (
        currentSection && (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-[#222] sm:text-[1.35rem]">
              {currentSection}
            </h2>
            <div className="flex flex-col">
              {questions.map((question: Question) => (
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
              ))}
            </div>
          </div>
        )
      )}

      <SurveyNavigation
        allowParticipantNavigation={allowParticipantNavigation}
        isFacilitator={isFacilitator}
        handleNavigation={handleNavigation}
        length={3}  // TODO: update this when implement custom section
        index={currentGroupIndex}
      />
    </div>
  );
};

export default SectionBySectionMode;
