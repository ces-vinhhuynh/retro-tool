import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { cn } from '@/utils/cn';
import { getAvatarCharacters } from '@/utils/user';

import { Score } from '../types/health-check';
import { getScoreColors } from '../utils/color';

// Updated color mapping to handle different scales
const SCORE_COLORS = {
  1: 'bg-red-600',
  2: 'bg-red-500',
  3: 'bg-orange-500',
  4: 'bg-orange-400',
  5: 'bg-yellow-400',
  6: 'bg-yellow-500',
  7: 'bg-lime-400',
  8: 'bg-green-400',
  9: 'bg-green-500',
  10: 'bg-green-600',
} as const;

const SAVE_DELAY = 2000;

const DEBOUNCE_TIME = 1000;

export interface SurveyQuestionRowProps {
  question: {
    id: string;
    text: string;
    description?: string;
    required?: boolean;
  };
  value: number | undefined;
  comment: string;
  onValueChange: (value: number) => void;
  onCommentChange: (comment: string[]) => void | Promise<void>;
  disabled?: boolean;
  minScore: Score;
  maxScore: Score;
}

function getScoreColor(
  value: number | undefined,
  score: number,
  maxValue: number,
): string {
  if (!value) {
    // Scale the color based on the score's position in the range
    const colorIndex = Math.round((score / maxValue) * 10);
    return SCORE_COLORS[colorIndex as keyof typeof SCORE_COLORS] || 'bg-muted';
  }
  return value === score
    ? SCORE_COLORS[
        Math.round((score / maxValue) * 10) as keyof typeof SCORE_COLORS
      ]
    : 'bg-muted';
}

const SurveyQuestionRow = ({
  question,
  value,
  comment,
  onValueChange,
  onCommentChange,
  disabled,
  minScore,
  maxScore,
}: SurveyQuestionRowProps) => {
  // Get current user data
  const { data: currentUser } = useCurrentUser();

  const [showSaved, setShowSaved] = useState(false);
  const [localComment, setLocalComment] = useState(comment);

  useEffect(() => {
    setLocalComment(comment);
  }, [comment]);

  // Handle save indicator
  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => setShowSaved(false), SAVE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  const debouncedCommentChange = useMemo(() => {
    return debounce(async (comments: string[]) => {
      await onCommentChange(comments);
    }, DEBOUNCE_TIME);
  }, [onCommentChange]);

  const handleCommentChange = async (newComment: string) => {
    try {
      setLocalComment(newComment);
      // Split by newlines and filter empty lines
      const comments = newComment.split('\n').filter(Boolean);

      await debouncedCommentChange(comments);
      setShowSaved(true);
    } catch {
      toast.error('Failed to save comment');
    }
  };

  return (
    <div className="relative flex min-w-0 flex-col gap-3 px-2 py-2 sm:gap-4 sm:px-3 sm:py-3 md:px-4 md:py-4 lg:px-6 lg:py-4">
      <div className="flex min-w-0 flex-col gap-1">
        <Label
          className="text-foreground flex min-w-0 items-center gap-2 text-base font-bold tracking-tight uppercase sm:text-lg"
          htmlFor={'comment_' + question.id}
        >
          <span>{question.text}</span>
        </Label>
        {question.description && (
          <span className="text-muted-foreground min-w-0 text-xs sm:text-sm">
            {question.description}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-1 sm:gap-4 md:flex-row md:items-center md:gap-6 lg:gap-8">
        <div className="mb-2 hidden justify-center gap-2 sm:flex">
          {Array.from(
            { length: maxScore.value - minScore.value + 1 },
            (_, i) => i + minScore.value,
          ).map((score) => {
            const buttonColor = getScoreColor(value, score, maxScore.value);

            return (
              <Button
                key={score}
                variant="default"
                size="icon"
                className={cn(
                  `h-8 w-8 rounded-full font-bold text-white transition hover:cursor-pointer`,
                  value === score && 'scale-110',
                  buttonColor,
                )}
                disabled={disabled}
                onClick={() => onValueChange(score)}
              >
                {score}
              </Button>
            );
          })}
        </div>

        <div className="mb-2 flex w-full flex-col gap-2 sm:hidden">
          <Slider
            min={minScore.value}
            max={maxScore.value}
            step={1}
            value={[value ?? minScore.value]}
            onValueChange={([val]: [number]) => onValueChange(val)}
            disabled={disabled}
            className="w-full"
            thumbClassName={getScoreColors(Number(value))?.circle}
          />
          <div className="flex justify-between text-xs text-gray-500">
            {Array.from(
              { length: maxScore.value - minScore.value + 1 },
              (_, i) => i + minScore.value,
            ).map((num) => (
              <span
                key={num}
                className={cn(
                  'font-bold',
                  value === num
                    ? getScoreColors(Number(value))?.text
                    : 'text-gray-500',
                )}
              >
                {num}
              </span>
            ))}
          </div>
        </div>

        <div className="text-muted-foreground flex min-w-0 flex-col text-[10px] sm:text-xs">
          <span className="truncate">
            {minScore.value}: {minScore.context}
          </span>
          <span className="truncate">
            {maxScore.value}: {maxScore.context}
          </span>
        </div>
      </div>

      <div className="relative w-full min-w-0">
        <Avatar className="absolute -top-0 -left-2 z-10 h-6 w-6 flex-shrink-0 border sm:-left-3 sm:h-8 sm:w-8">
          <AvatarImage
            src={currentUser?.user_metadata?.avatar_url ?? ''}
            alt={
              currentUser?.user_metadata?.full_name ??
              currentUser?.email ??
              'User'
            }
          />
          <AvatarFallback>
            {getAvatarCharacters(
              currentUser?.user_metadata?.full_name ??
                currentUser?.email?.split('@')[0] ??
                'User',
            )}
          </AvatarFallback>
        </Avatar>

        <div className="relative min-w-0">
          <Textarea
            id={'comment_' + question.id}
            placeholder="Add comments (one per line)..."
            className="resize-none pl-10 text-sm sm:pl-12 sm:text-base"
            value={localComment}
            onChange={(e) => handleCommentChange(e.target.value)}
            disabled={disabled}
            rows={3}
          />
          {showSaved && (
            <span className="absolute right-2 bottom-[-20px] text-xs font-medium text-green-600 sm:bottom-[-24px] sm:text-sm">
              Saved
            </span>
          )}
          <p className="text-muted-foreground mt-1 text-[10px] sm:text-xs">
            Press Enter for new line. Each line will be saved as a separate
            comment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SurveyQuestionRow;
