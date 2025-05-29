import { Info } from 'lucide-react';

import { cn } from '@/utils/cn';

interface QuestionRowProps {
  title: string;
  description: string;
  isShowAddNew?: boolean;
}

const QuestionRow = ({
  title,
  description,
  isShowAddNew,
}: QuestionRowProps) => {
  return (
    <div
      className={cn(
        'flex h-16 w-32 min-w-0 items-center gap-1 border-r border-b border-gray-200 p-2 md:w-56 lg:w-68',
        { 'w-20': isShowAddNew },
      )}
    >
      <div className="flex w-full min-w-0 items-center justify-between">
        <span className="truncate text-xs font-medium sm:text-sm">{title}</span>
        <button
          className="ml-1 shrink-0 hover:text-gray-600"
          title={description}
        >
          <Info size={14} className="sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
        </button>
      </div>
    </div>
  );
};

export default QuestionRow;
