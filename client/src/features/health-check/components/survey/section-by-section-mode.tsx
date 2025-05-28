'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import SurveyQuestionRow from '@/features/health-check/components/survey-question-row';
import {
  AnswerSurvey,
  GroupedQuestions,
  Question,
  Score,
} from '@/features/health-check/types/health-check';

import AdditionalQuestion from '../additional-question';

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
}: SectionBySectionModeProps) => {
  const [currentTab, setCurrentTab] = useState<string>('');

  const currentQuestions = groupedQuestions[currentTab] || [];

  useEffect(() => {
    if (!currentTab && sections.length > 0) {
      setCurrentTab(sections[0]);
    }
  }, [sections, currentTab]);

  const handleNavigation = (direction: 'next' | 'previous') => {
    const currentIndex = sections.indexOf(currentTab);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < sections.length) {
      setCurrentTab(sections[newIndex]);
    }
  };

  return (
    <>
      {currentTab !== 'Additional Questions' ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-[#222] sm:text-[1.35rem]">
            {currentTab}
          </h2>
          <div className="flex flex-col">
            {currentQuestions.map((question: Question) => (
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
      ) : (
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
      <div className="flex justify-between gap-4 py-4">
        <Button
          onClick={() => handleNavigation('previous')}
          disabled={currentTab === sections[0]}
          className="bg-ces-orange-500 hover:bg-ces-orange-600 w-full text-white sm:w-auto"
        >
          Previous
        </Button>
        {currentTab !== sections[sections.length - 1] && (
          <Button
            onClick={() => handleNavigation('next')}
            disabled={currentTab === sections[sections.length - 1]}
            className="bg-ces-orange-500 hover:bg-ces-orange-600 w-full text-white sm:w-auto"
          >
            Next
          </Button>
        )}
      </div>
    </>
  );
};

export default SectionBySectionMode;
