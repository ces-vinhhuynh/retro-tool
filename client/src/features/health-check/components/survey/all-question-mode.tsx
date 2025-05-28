'use client';

import SurveyQuestionRow from '@/features/health-check/components/survey-question-row';
import {
  AnswerSurvey,
  GroupedQuestions,
  Question,
  Score,
} from '@/features/health-check/types/health-check';

import AdditionalQuestion from '../additional-question';

interface AllQuestionModeProps {
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
}

export default function AllQuestionMode({
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
}: AllQuestionModeProps) {
  const regularSections = sections.filter(
    (section) => section !== 'Additional Questions',
  );
  const hasAdditionalQuestions = sections.includes('Additional Questions');

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {regularSections.map((section) => (
        <div
          key={section}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-[#222] sm:text-[1.35rem]">
            {section}
          </h2>
          <div className="flex flex-col">
            {(groupedQuestions[section] || []).map((question: Question) => (
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
      ))}

      {/* Additional Questions */}
      {hasAdditionalQuestions && (
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
      )}
    </div>
  );
}
