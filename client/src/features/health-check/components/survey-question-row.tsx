import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { cn } from '@/utils/cn';
import { getAvatarCharacters } from '@/utils/user';

import { Score } from '../types/health-check';

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

  // Handle save indicator
  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => setShowSaved(false), SAVE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  const handleCommentChange = async (newComment: string) => {
    try {
      setLocalComment(newComment);
      // Split by newlines and filter empty lines
      const comments = newComment
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      await onCommentChange(comments);
      setShowSaved(true);
    } catch {
      toast.error('Failed to save comment');
    }
  };

  return (
    <div className="relative my-6 flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <Label
          className="text-foreground flex items-center gap-2 text-lg font-bold tracking-tight uppercase"
          htmlFor={'comment_' + question.id}
        >
          {question.text}
        </Label>
        {question.description && (
          <span className="text-muted-foreground text-sm">
            {question.description}
          </span>
        )}
      </div>

      <div className="flex items-center gap-8">
        <div className="flex gap-2">
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

        <div className="text-muted-foreground hidden text-xs sm:flex sm:flex-col">
          <span>
            {minScore.value}: {minScore.context}
          </span>
          <span>
            {maxScore.value}: {maxScore.context}
          </span>
        </div>
      </div>

      <div className="relative w-full">
        <Avatar className="absolute -top-0 -left-3 z-10 h-8 w-8 border">
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

        <div className="relative">
          <Textarea
            id={'comment_' + question.id}
            placeholder="Add comments (one per line)..."
            className="resize-none pl-12 font-sans"
            value={localComment}
            onChange={(e) => handleCommentChange(e.target.value)}
            disabled={disabled}
            rows={3}
          />
          {showSaved && (
            <span className="absolute right-2 bottom-[-24] text-sm font-medium text-green-600">
              Saved
            </span>
          )}
          <p className="text-muted-foreground mt-1 text-xs">
            Press Enter for new line. Each line will be saved as a separate
            comment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SurveyQuestionRow;
