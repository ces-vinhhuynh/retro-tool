'use client';

import { Info } from 'lucide-react';

import { cn } from '@/utils/cn';

interface QuestionRowProps {
  title: string;
  description: string;
  isShowAddNew?: boolean;
  height?: string;
  width?: string;
}

const QuestionRow = ({
  title,
  description,
  isShowAddNew,
  height = 'h-16',
  width = 'w-32 md:w-56 lg:w-68',
}: QuestionRowProps) => {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-1 border-r border-b border-gray-200 p-2',
        height,
        width,
        { 'w-28': isShowAddNew && !width }, // Fallback for isShowAddNew
      )}
    >
      <div className="flex w-full min-w-0 items-center justify-between">
        <span className="truncate text-xs font-medium sm:text-sm">{title}</span>
        <button
          className="ml-1 shrink-0 hover:text-gray-600 transition-colors"
          title={description}
        >
          <Info size={14} className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
        </button>
      </div>
    </div>
  );
};

export default QuestionRow;