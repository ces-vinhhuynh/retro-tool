import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Score } from '@/features/health-check/types/health-check';
import { cn } from '@/utils/cn';
import { HINT_SCORE } from '@/utils/constant';

import { getScoreColor } from '../utils/color';

// Dummy current user data (replace with actual user info in a real app)
const currentUser = {
  name: 'Alex Johnson',
  avatarUrl: '',
};

export interface SurveyQuestionRowProps {
  question: {
    id: string;
    text: string;
    description?: string;
    required?: boolean;
  };
  scoreSelected: number | undefined;
  comment: string;
  onValueChange: (value: number) => void;
  onCommentChange: (comment: string) => void;
  disabled?: boolean;
  minScore?: Score;
  maxScore?: Score;
}

export const SurveyQuestionRow = ({
  question,
  scoreSelected,
  comment,
  onValueChange,
  onCommentChange,
  disabled,
  minScore = { value: 1, context: HINT_SCORE.MIN },
  maxScore = { value: 10, context: HINT_SCORE.MAX },
}: SurveyQuestionRowProps) => {
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
            const buttonColor = getScoreColor({
              scoreSelected,
              score,
              maxScore: maxScore.value,
            });

            return (
              <Button
                key={score}
                variant="default"
                size="icon"
                className={cn(
                  `h-8 w-8 rounded-full font-bold text-white transition hover:cursor-pointer`,
                  buttonColor,
                  {
                    'scale-110': scoreSelected === score,
                  }
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
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          <AvatarFallback>
            {currentUser.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <Textarea
          id={'comment_' + question.id}
          placeholder="Add a comment (optional)..."
          className="resize-none pl-12 font-sans"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          disabled={disabled}
          maxLength={256}
        />
      </div>
    </div>
  );
};

export default SurveyQuestionRow;
