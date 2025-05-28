'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import AdditionalItemRow from './addtional-item-row';

interface AdditionalQuestionProps {
  title: string;
  description: string;
  answers: string[];
  newAnswer: string;
  setNewAnswer: (answer: string) => void;
  handleAddAnswer: () => void;
  handleAnswerChange: (index: number, value: string) => void;
  handleDeleteAnswer: (index: number) => void;
}

const AdditionalQuestion = ({
  title,
  description,
  answers,
  newAnswer,
  setNewAnswer,
  handleAddAnswer,
  handleAnswerChange,
  handleDeleteAnswer,
}: AdditionalQuestionProps) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-xl font-bold text-[#222] sm:text-[1.35rem]">
        {title}
      </h2>
      <div className="space-y-6">
        <h3 className="mb-1 text-lg font-bold text-[#222] sm:text-xl">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm">{description}</p>
        <div className="flex items-center gap-2 p-1">
          <Input
            type="text"
            placeholder={`${title} ${answers.length + 1}`}
            value={newAnswer}
            onChange={(e) => {
              const value = e.target.value;
              setNewAnswer(value);
              // No auto-save for the draft item - only save when Add button is clicked
            }}
            onKeyDown={(e) => {
              // Add item when Enter is pressed
              if (e.key === 'Enter' && newAnswer.trim()) {
                e.preventDefault();
                handleAddAnswer();
              }
            }}
            className="focus:border-ces-orange-500 focus:ring-ces-orange-500 flex-1 rounded-lg border border-gray-200 bg-[#F7F7F7] focus:ring-1"
          />
          <Button
            variant="default"
            size="sm"
            disabled={!newAnswer}
            onClick={handleAddAnswer}
            className="bg-ces-orange-500 hover:bg-ces-orange-300 whitespace-nowrap text-white"
          >
            <Plus size={14} className="mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs italic">
            You can edit any existing item by clicking on it and making changes.
          </p>
          <div className="flex max-h-72 flex-col space-y-4 overflow-y-auto p-1">
            {answers.map((answer, index) => (
              <AdditionalItemRow
                key={index}
                value={answer}
                onChange={(val) => handleAnswerChange(index, val)}
                onDelete={() => handleDeleteAnswer(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalQuestion;
