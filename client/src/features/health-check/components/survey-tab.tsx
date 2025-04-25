'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { SurveyQuestionRow } from '@/features/health-check/components/survey-question-row';
import {
  GroupedQuestions,
  Score,
} from '@/features/health-check/types/health-check';
import { ADDITIONAL_QUESTIONS } from '@/utils/constant';

interface Answers {
  responses: Record<string, number>;
  comments: Record<string, string>;
}

type SurveyTabProps = {
  sections: string[];
  groupedQuestions: GroupedQuestions;
  minScore: Score;
  maxScore: Score;
};

export const SurveyTab = ({
  sections,
  groupedQuestions,
  minScore,
  maxScore,
}: SurveyTabProps) => {
  const [currentTab, setCurrentTab] = useState('');
  const [additionalInput, setAdditionalInput] = useState('');
  const [additionalItems, setAdditionalItems] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({
    responses: {},
    comments: {},
  });

  const onResponseChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      responses: { ...prev.responses, [questionId]: value },
    }));
  };

  const onCommentChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      comments: { ...prev.comments, [questionId]: value },
    }));
  };

  useEffect(() => {
    if (!currentTab && sections.length > 0) {
      setCurrentTab(sections[0]);
    }
  }, [sections, currentTab]);

  const totalQuestions = Object.values(groupedQuestions)
    .filter((questions) => questions[0]?.section !== ADDITIONAL_QUESTIONS)
    .reduce((sum, questions) => sum + questions.length, 0);

  const answeredQuestions = Object.keys(answers.responses).length;
  const progress =
    totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  const currentQuestions = groupedQuestions[currentTab] || [];
  const additionalQuestions = groupedQuestions[ADDITIONAL_QUESTIONS] || [];

  const additionalTitle = additionalQuestions[0].title ?? 'Title';
  const additionalDescription = additionalQuestions[0].description ?? '';

  const handleNavigation = (direction: 'next' | 'previous') => {
    const currentIndex = sections.indexOf(currentTab);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < sections.length) {
      setCurrentTab(sections[newIndex]);
    }
  };

  const handleAdditionalItem = () => {
    if (!additionalInput.trim()) return;
    setAdditionalItems((prev) => [...prev, additionalInput.trim()]);
    setAdditionalInput('');
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
        {currentTab !== ADDITIONAL_QUESTIONS ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-[#222] sm:text-[1.35rem]">
              {currentTab}
            </h2>
            <div className="space-y-6">
              {currentQuestions.map((question) => (
                <SurveyQuestionRow
                  key={question.id}
                  question={{
                    id: question.id,
                    text: question.title,
                    description: question.description,
                    required: true,
                  }}
                  scoreSelected={answers.responses[question.id]}
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
              <div className="flex justify-end">
                <Button
                  variant="default"
                  size="sm"
                  disabled={!additionalInput}
                  onClick={handleAdditionalItem}
                  className="bg-[#E15D2F] whitespace-nowrap text-white hover:bg-[#eeaa83]"
                >
                  <Plus size={14} className="mr-1" />
                  Add
                </Button>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={`Challenge ${additionalItems.length + 1}`}
                    value={additionalInput}
                    onChange={(e) => setAdditionalInput(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 bg-[#F7F7F7]"
                  />
                </div>

                {additionalItems.map((item, index) => (
                  <Input
                    key={index}
                    type="text"
                    value={item}
                    readOnly
                    className="rounded-lg border border-gray-200 bg-[#F7F7F7]"
                  />
                ))}
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
          <Button
            onClick={() => handleNavigation('next')}
            disabled={currentTab === sections[sections.length - 1]}
            className="w-full bg-[#E15D2F] text-white hover:bg-[#eeaa83] sm:w-auto"
          >
            {currentTab === sections[sections.length - 1]
              ? 'Waiting for facilitator'
              : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyTab;
