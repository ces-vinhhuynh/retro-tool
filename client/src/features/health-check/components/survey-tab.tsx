'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import SurveyQuestionRow from '@/features/health-check/components/survey-question-row';

import { useUpdateResponse } from '../hooks/use-response';
import { GroupedQuestions, Question, Response } from '../types/health-check';

interface Answers {
  responses: Record<string, number>;
  comments: Record<string, string>;
}

// Interface for the answer structure in the database
interface QuestionAnswer {
  rating: number | null;
  comment: string[];
  vote?: number;
  created_at: string;
  updated_at: string;
}

type SurveyTabProps = {
  sections: string[];
  groupedQuestions: GroupedQuestions;
  minScore: number;
  maxScore: number;
  response: Response | null | undefined;
};

export default function SurveyTab({
  sections,
  groupedQuestions,
  minScore,
  maxScore,
  response,
}: SurveyTabProps) {
  const { mutate: updateQuestionAnswer } = useUpdateResponse();
  const [currentTab, setCurrentTab] = useState<string>('');
  const [additionalItems, setAdditionalItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [answers, setAnswers] = useState<Answers>({
    responses: (response?.answers as Record<string, number>) || {},
    comments: {},
  });

  const currentQuestions = groupedQuestions[currentTab] || [];
  const additionalQuestions = groupedQuestions['Additional Questions'] || [];

  const saveAdditionalItemsImmediate = async (items: string[]) => {
    if (response && additionalQuestions.length > 0) {
      const questionId = additionalQuestions[0].id;

      updateQuestionAnswer({
        id: response.id,
        questionId,
        answer: {
          comment: items.filter(Boolean),
        },
      });
    }
  };

  const onResponseChange = (questionId: string, value: number) => {
    setAnswers((prev) => {
      const newResponses = { ...prev.responses, [questionId]: value };
      if (response) {
        updateQuestionAnswer({
          id: response.id,
          questionId,
          answer: {
            rating: value,
          },
        });
      }

      return {
        ...prev,
        responses: newResponses,
      };
    });
  };

  const onCommentChange = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const newComments = { ...prev.comments, [questionId]: value };
      if (response) {
        updateQuestionAnswer({
          id: response.id,
          questionId,
          answer: {
            comment: value ? [value] : [],
          },
        });
      }

      return {
        ...prev,
        comments: newComments,
      };
    });
  };

  useEffect(() => {
    if (!response?.answers) return;
    const answersObj = response.answers as unknown as Record<
      string,
      QuestionAnswer
    >;
    const responses: Record<string, number> = {};
    const comments: Record<string, string> = {};

    Object.entries(answersObj).forEach(([questionId, answer]) => {
      if (answer && typeof answer === 'object') {
        if (answer.rating !== null && answer.rating !== undefined) {
          responses[questionId] = answer.rating;
        }
        if (
          answer.comment &&
          Array.isArray(answer.comment) &&
          answer.comment.length > 0
        ) {
          comments[questionId] = answer.comment.join('\n');
        }
      }
    });

    setAnswers({
      responses,
      comments,
    });

    if (additionalQuestions.length > 0) {
      const questionId = additionalQuestions[0].id;
      const additionalAnswer = answersObj[questionId];
      if (
        additionalAnswer?.comment &&
        Array.isArray(additionalAnswer.comment)
      ) {
        const items = [...additionalAnswer.comment];
        if (items.length > 0) {
          setAdditionalItems(items);
        }
      }
    }
  }, [response, additionalQuestions]);

  useEffect(() => {
    if (!currentTab && sections.length > 0) {
      setCurrentTab(sections[0]);
    }
  }, [sections, currentTab]);

  const totalQuestions = Object.values(groupedQuestions)
    .filter((questions) => questions[0]?.section !== 'Additional Questions')
    .reduce((sum: number, questions) => sum + questions.length, 0);

  const answeredQuestions = Object.keys(answers.responses).length;
  const progress =
    totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  const additionalTitle = additionalQuestions[0]?.title ?? 'Title';
  const additionalDescription = additionalQuestions[0]?.description ?? '';

  const handleNavigation = (direction: 'next' | 'previous') => {
    const currentIndex = sections.indexOf(currentTab);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < sections.length) {
      setCurrentTab(sections[newIndex]);
    }
  };

  const handleAdditionalItem = async () => {
    if (!newItem.trim()) return;
    const trimmedValue = newItem.trim();
    setNewItem('');

    const newItems = [...additionalItems, trimmedValue];
    setAdditionalItems(newItems);

    await saveAdditionalItemsImmediate(newItems);
  };

  const handleItemChange = async (index: number, value: string) => {
    const updatedItems = additionalItems.map((item, i) =>
      i === index ? value : item,
    );
    setAdditionalItems(updatedItems);
    await saveAdditionalItemsImmediate(updatedItems);
  };

  const handleDeleteItem = async (index: number) => {
    const updatedItems = [...additionalItems];
    updatedItems.splice(index, 1);
    setAdditionalItems(updatedItems);

    await saveAdditionalItemsImmediate(updatedItems);
  };

  return (
    <Card className="mx-auto w-full max-w-4xl lg:w-2/3">
      <CardContent className="space-y-8 p-6">
        {/* Progress Section */}
        <div className="w-full space-y-2 sm:w-1/3 lg:w-1/5">
          <Progress value={progress} className="h-2" />
          <div className="text-muted-foreground text-right text-sm">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Main Content */}
        {currentTab !== 'Additional Questions' ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-[#222] sm:text-[1.35rem]">
              {currentTab}
            </h2>
            <div className="space-y-6">
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
                  minValue={minScore}
                  maxValue={maxScore}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-[#222] sm:text-[1.35rem]">
              Additional Questions
            </h2>
            <div className="space-y-6">
              <h3 className="mb-1 text-lg font-bold text-[#222] sm:text-xl">
                {additionalTitle}
              </h3>
              <p className="text-muted-foreground text-sm">
                {additionalDescription}
              </p>
              <div className="flex items-center gap-2 p-1">
                <Input
                  type="text"
                  placeholder={`Challenge ${additionalItems.length + 1}`}
                  value={newItem}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewItem(value);
                    // No auto-save for the draft item - only save when Add button is clicked
                  }}
                  onKeyDown={(e) => {
                    // Add item when Enter is pressed
                    if (e.key === 'Enter' && newItem.trim()) {
                      e.preventDefault();
                      handleAdditionalItem();
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-200 bg-[#F7F7F7] focus:border-[#E15D2F] focus:ring-1 focus:ring-[#E15D2F]"
                />
                <Button
                  variant="default"
                  size="sm"
                  disabled={!newItem}
                  onClick={handleAdditionalItem}
                  className="bg-[#E15D2F] whitespace-nowrap text-white hover:bg-[#eeaa83]"
                >
                  <Plus size={14} className="mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs italic">
                  You can edit any existing item by clicking on it and making
                  changes.
                </p>
                <div className="flex max-h-72 flex-col space-y-4 overflow-y-auto p-1">
                  {additionalItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleItemChange(index, e.target.value)
                        }
                        className="flex-1 rounded-lg border border-gray-200 bg-[#F7F7F7] focus:border-[#E15D2F] focus:ring-1 focus:ring-[#E15D2F]"
                        placeholder="Click to edit this item"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(index)}
                        className="h-10 w-10 text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 py-4">
          <Button
            onClick={() => handleNavigation('previous')}
            disabled={currentTab === sections[0]}
            className="w-full bg-[#E15D2F] text-white hover:bg-[#eeaa83] sm:w-auto"
          >
            Previous
          </Button>
          {currentTab !== sections[sections.length - 1] && (
            <Button
              onClick={() => handleNavigation('next')}
              disabled={currentTab === sections[sections.length - 1]}
              className="w-full bg-[#E15D2F] text-white hover:bg-[#eeaa83] sm:w-auto"
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
