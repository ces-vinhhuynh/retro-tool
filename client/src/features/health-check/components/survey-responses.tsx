import { formatCommentDate } from '@/features/health-check/utils/time-format';

interface SurveyResponsesProps {
  comments: { comment: string; created_at: string }[];
}

export default function SurveyResponses({ comments }: SurveyResponsesProps) {
  return (
    <div className="gap-4">
      {comments && comments.length > 0 && (
        <div className="pt-4">
          <h3 className="text-sm uppercase">Survey Responses</h3>
          {comments.map((comment, index) => (
            <div className="flex items-center py-1" key={index}>
              <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                <span className="text-sm">{comment.comment}</span>
                <span className="text-xs text-gray-400">
                  {formatCommentDate(comment.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
