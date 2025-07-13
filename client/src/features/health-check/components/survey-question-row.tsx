import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { getAvatarCharacters } from '@/utils/user';

import { Score } from '../types/health-check';
import { splitAndCleanLines } from '../utils/comment';
import { COMMENT_MAX_LENGTH } from '../utils/constants';

import ScoreButton from './score-button';

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
  const scores = Array.from(
    { length: maxScore.value - minScore.value + 1 },
    (_, i) => i + minScore.value,
  );
  const mid = Math.floor((minScore.value + maxScore.value) / 2);
  const firstHalf = scores.slice(0, mid - minScore.value + 1);
  const secondHalf = scores.slice(mid - minScore.value + 1);

  useEffect(() => {
    setLocalComment(comment);
  }, [comment]);

  useEffect(() => {
    setLocalComment(comment ?? '');
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
      const comments = splitAndCleanLines(newComment);

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
          {scores.map((score) => (
            <ScoreButton
              key={score}
              score={score}
              value={value ?? 0}
              maxScore={maxScore.value}
              disabled={!!disabled}
              onValueChange={onValueChange}
            />
          ))}
        </div>

        <div className="mb-2 flex w-full flex-col gap-2 sm:hidden">
          {[firstHalf, secondHalf].map((scoreGroup, index) => (
            <div key={index}>
              <div className="p-1">
                <div className="flex flex-wrap justify-center gap-3">
                  {scoreGroup.map((score) => (
                    <ScoreButton
                      key={score}
                      score={score}
                      value={value ?? 0}
                      maxScore={maxScore.value}
                      disabled={!!disabled}
                      onValueChange={onValueChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
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
          <span className="text-muted-foreground absolute top-[-20] right-2 text-xs sm:text-sm">
            {localComment.length}/{COMMENT_MAX_LENGTH}
          </span>
          <Textarea
            id={'comment_' + question.id}
            placeholder="Press Enter for new line. Each line will be saved as a separate comment."
            className="resize-none pl-10 text-sm sm:pl-12 sm:text-base"
            value={localComment}
            onChange={(e) => handleCommentChange(e.target.value)}
            disabled={disabled}
            rows={3}
            maxLength={COMMENT_MAX_LENGTH}
          />

          <div className="flex justify-between gap-2">
            <p className="text-muted-foreground mt-1 hidden text-[10px] sm:block sm:text-xs">
              Press Enter for new line. Each line will be saved as a separate
              comment.
            </p>
            {showSaved && (
              <span className="text-xs font-medium text-green-600 sm:text-sm">
                Saved
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyQuestionRow;
