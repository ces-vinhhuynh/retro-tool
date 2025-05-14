import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { cn } from '@/utils/cn';

import { getAvatarCharacters } from '../utils/user';

const SCORE_LABELS = {
  min: 'Never / Poor performance',
  max: 'Always / Excellent performance',
} as const;

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
  onCommentChange: (comment: string) => void | Promise<void>;
  disabled?: boolean;
  minValue?: number;
  maxValue?: number;
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

export default function SurveyQuestionRow({
  question,
  value,
  comment,
  onValueChange,
  onCommentChange,
  disabled,
  minValue = 1,
  maxValue = 10,
}: SurveyQuestionRowProps) {
  // Get current user data
  const { data: currentUser } = useCurrentUser();

  const [showSaved, setShowSaved] = useState(false);

  // Handle save indicator
  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => setShowSaved(false), SAVE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  const handleCommentChange = async (newComment: string) => {
    try {
      await onCommentChange(newComment);
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
            { length: maxValue - minValue + 1 },
            (_, i) => i + minValue,
          ).map((score) => {
            const buttonColor = getScoreColor(value, score, maxValue);

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
            {minValue}: {SCORE_LABELS.min}
          </span>
          <span>
            {maxValue}: {SCORE_LABELS.max}
          </span>
        </div>
      </div>

      <div className="relative w-full">
        <Avatar className="absolute -top-0 -left-3 z-10 h-8 w-8 border">
          <AvatarImage
            src={currentUser?.user_metadata?.avatar_url || ''}
            alt={
              currentUser?.user_metadata?.full_name ||
              currentUser?.email ||
              'User'
            }
          />
          <AvatarFallback>
            {getAvatarCharacters(
              currentUser?.user_metadata?.full_name ||
                currentUser?.email?.split('@')[0] ||
                'User',
            )}
          </AvatarFallback>
        </Avatar>

        <div className="relative">
          <Textarea
            id={'comment_' + question.id}
            placeholder="Add a comment (optional)..."
            className="resize-none pl-12 font-sans"
            value={comment}
            onChange={(e) => handleCommentChange(e.target.value)}
            disabled={disabled}
            maxLength={256}
          />
          {showSaved && (
            <span className="absolute right-2 bottom-[-24] text-sm font-medium text-green-600">
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
