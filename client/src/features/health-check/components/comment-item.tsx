import { MessageSquareShare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CommentItemProps {
  comment: string;
  shouldClamp: boolean;
  isExpanded: boolean;
  toggleExpand: (comment: string, isExpanded: boolean) => void;
  onClickCreateIssue: (comment: string) => void;
}

const CommentItem = ({
  comment,
  shouldClamp,
  isExpanded,
  toggleExpand,
  onClickCreateIssue,
}: CommentItemProps) => {
  return (
    <div className="flex items-start bg-white">
      <div className="w-full border border-gray-200 p-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <p
              className={cn(
                'text-sm whitespace-pre-line',
                shouldClamp && !isExpanded && 'line-clamp-2',
              )}
            >
              {comment}
            </p>
            {shouldClamp && (
              <button
                onClick={() => toggleExpand(comment, isExpanded)}
                className="cursor-pointer text-xs text-blue-600 no-underline"
              >
                {isExpanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-ces-orange-50 hover:text-ces-orange-500 size-9 cursor-pointer rounded-full text-gray-500"
                  onClick={() => onClickCreateIssue(comment)}
                >
                  <MessageSquareShare className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                align="end"
                alignOffset={-20}
                className="bg-ces-orange-100 text-ces-orange-500 text-xs font-medium"
              >
                <p>Create Long term issue</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
