import { MessageSquare } from 'lucide-react';

import { AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { Question, Response } from '@/features/health-check/types/health-check';
import { getScoreColors } from '@/features/health-check/utils/color';
import { getCommentCount } from '@/features/health-check/utils/comment';
import { getRatings } from '@/features/health-check/utils/rating';
import { cn } from '@/utils/cn';

export default function QuestionAccordionItem({
  question,
  responses,
}: {
  question: Question;
  responses: Response[];
}) {
  const ratings = getRatings(responses, question.id);
  const commentCount = getCommentCount(responses, question.id);
  const hasScore = ratings.length > 0;
  const avgScore = hasScore
    ? ratings.reduce((sum, r) => sum + r.score * r.count, 0) /
      ratings.reduce((sum, r) => sum + r.count, 0)
    : undefined;
  const colors =
    hasScore && avgScore !== undefined
      ? getScoreColors(Number(avgScore))
      : undefined;

  return (
    <AccordionItem
      key={question.id}
      value={question.id}
      className={cn(
        'rounded-lg border transition-colors duration-500',
        colors?.bg,
      )}
    >
      <div className="px-4 hover:no-underline [&[data-state=open]>div]:pb-2">
        <div className="flex w-full items-start justify-between gap-4 py-4">
          <div className="flex items-start gap-3">
            {hasScore && colors ? (
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full',
                  colors.circle,
                )}
              >
                <span className="text-2xl font-bold text-white">
                  {Number(avgScore).toFixed(1)}
                </span>
              </div>
            ) : null}
            <h3 className="float-start self-center font-medium text-gray-900">
              {question.title}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-2 self-center">
            {commentCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MessageSquare size={15} />
                <span>{commentCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <AccordionContent className="px-4 pb-4">
        <div className="px-1">
          <p className="pb-1 text-sm">{question.description}</p>
          <div className="flex items-center gap-2">
            {ratings.map(({ score, count }) => (
              <div key={score} className="flex items-center gap-1">
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xl font-medium text-white',
                    getScoreColors(score).circle,
                  )}
                >
                  {score}
                </span>
                <span className="text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
