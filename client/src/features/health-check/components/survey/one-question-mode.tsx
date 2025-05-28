'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import {
  AnswerSurvey,
  GroupedQuestions,
  Question,
  Score,
} from '../../types/health-check';
import AdditionalQuestion from '../additional-question';
import SurveyQuestionRow from '../survey-question-row';

interface OneQuestionModeProps {
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

interface QuestionWithSection extends Question {
  section: string;
  sectionIndex: number;
  questionIndex: number;
}

const OneQuestionMode = ({
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
}: OneQuestionModeProps) => {
  const regularSections = sections.filter(
    (section) => section !== 'Additional Questions',
  );

  const allQuestions = regularSections.reduce<QuestionWithSection[]>(
    (acc, section, sectionIndex) => {
      const sectionQuestions = (groupedQuestions[section] || []).map(
        (question, questionIndex) => ({
          ...question,
          section,
          sectionIndex,
          questionIndex,
        }),
      );
      return [...acc, ...sectionQuestions];
    },
    [],
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAdditionalQuestion, setIsAdditionalQuestion] = useState(false);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const hasAdditionalQuestions = sections.includes('Additional Questions');

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setIsAdditionalQuestion(false);
  }, []);

  const handleNavigation = (direction: 'next' | 'previous') => {
    if (direction === 'next') {
      if (currentQuestionIndex === allQuestions.length - 1) {
        if (hasAdditionalQuestions) {
          setIsAdditionalQuestion(true);
        }
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } else {
      if (isAdditionalQuestion) {
        setIsAdditionalQuestion(false);
        setCurrentQuestionIndex(allQuestions.length - 1);
      } else {
        setCurrentQuestionIndex((prev) => prev - 1);
      }
    }
  };

  return (
    <>
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
          currentQuestion && (
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-[#222] sm:text-[1.35rem]">
                  {currentQuestion.section}
                </h2>
              </div>
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
                onValueChange={(val) =>
                  onResponseChange(currentQuestion.id, val)
                }
                onCommentChange={(val) =>
                  onCommentChange(currentQuestion.id, val)
                }
                minScore={minScore}
                maxScore={maxScore}
              />
            </div>
          )
        )}

        {/* Navigation Controls */}
        <div className="flex justify-between gap-4 py-4">
          <Button
            onClick={() => handleNavigation('previous')}
            disabled={currentQuestionIndex === 0 && !isAdditionalQuestion}
            className="bg-ces-orange-500 hover:bg-ces-orange-600 w-full text-white sm:w-auto"
          >
            Previous
          </Button>
          {!isAdditionalQuestion && (
            <Button
              onClick={() => handleNavigation('next')}
              className="bg-ces-orange-500 hover:bg-ces-orange-600 w-full text-white sm:w-auto"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default OneQuestionMode;
