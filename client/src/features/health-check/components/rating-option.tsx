import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

import { RATING_OPTIONS } from '../utils/constants';

interface RatingOptionProps {
  option: (typeof RATING_OPTIONS)[number];
  isSelected: boolean;
  onSelect: (value: number) => void;
}

export default function RatingOption({
  option,
  isSelected,
  onSelect,
}: RatingOptionProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => onSelect(option.value)}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center border-2 border-transparent p-4',
            'hover:border-2 hover:border-[#00b8d4] focus:outline-none',
            isSelected && 'bg-[#00b8d4]',
          )}
        >
          <div
            className={cn(
              'mb-2 flex h-10 w-10 items-center justify-center rounded-full font-bold text-white',
              option.color,
            )}
          >
            {option.value}
          </div>
          <span
            className={cn(
              'text-xs font-medium',
              isSelected ? 'text-white' : '',
            )}
          >
            {option.label}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{option.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
