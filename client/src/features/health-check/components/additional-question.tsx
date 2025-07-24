'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { splitAndCleanLines } from '../utils/comment';
import { LONG_TEXT_INPUT_MAX_LENGTH } from '../utils/constants';

import { AdditionalItemRow } from './additional-item-row';

interface AdditionalQuestionProps {
  id: string;
  title: string;
  description: string;
  answers: string;
  handleAddAnswer: (questionId: string, newComment: string) => void;
  handleChangeAnswer: (
    questionId: string,
    index: number,
    value: string,
  ) => void;
  handleDeleteAnswer: (questionId: string, index: number) => void;
}

export const AdditionalQuestion = ({
  id,
  title,
  description,
  answers,
  handleAddAnswer,
  handleChangeAnswer,
  handleDeleteAnswer,
}: AdditionalQuestionProps) => {
  const [newComment, setNewComment] = useState('');
  const comments = splitAndCleanLines(answers);

  const addNewComment = () => {
    handleAddAnswer(id, newComment.trim());
    setNewComment('');
  };

  return (
    <div className="space-y-6 px-2 py-2 sm:gap-4 sm:px-3 sm:py-3 md:px-4 md:py-4 lg:px-6 lg:py-4">
      <h3 className="mb-1 text-lg font-bold text-[#222] sm:text-xl">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
      <div className="flex flex-col items-center gap-7 p-1 sm:flex-row sm:gap-2">
        <div className="relative w-full flex-1">
          <Input
            type="text"
            placeholder={`Answer ${comments.length + 1}`}
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addNewComment();
              }
            }}
            className="focus:border-primary focus:ring-primary rounded-lg border border-gray-200 bg-[#F7F7F7] focus:ring-1"
            maxLength={LONG_TEXT_INPUT_MAX_LENGTH}
          />
          <div className="absolute top-12 right-2 flex justify-end">
            <span className="text-muted-foreground text-xs">
              {newComment.length}/{LONG_TEXT_INPUT_MAX_LENGTH}
            </span>
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          disabled={!newComment}
          onClick={addNewComment}
          className="self-end whitespace-nowrap sm:self-center"
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
          {comments.map((answer, index) => (
            <AdditionalItemRow
              key={index}
              value={answer}
              onChange={(val) => handleChangeAnswer(id, index, val)}
              onDelete={() => handleDeleteAnswer(id, index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
