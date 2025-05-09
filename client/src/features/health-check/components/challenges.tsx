'use client';

import { Question, Response } from '@/features/health-check/types/health-check';
import { getTopChallenges } from '@/features/health-check/utils/comment';

interface TopChallengesProps {
  responses: Response[];
  questions: Question[];
}

export default function TopChallenges({
  responses,
  questions,
}: TopChallengesProps) {
  const challenges = getTopChallenges(responses, questions);

  return (
    <div>
      <div className="flex items-center justify-between py-6">
        <h3 className="text-2xl font-bold text-gray-900">Top Challenges</h3>
      </div>

      {challenges.length > 0 ? (
        <ul className="animate-fade-in space-y-2">
          {challenges.map((challenge, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded bg-orange-50 px-3 py-2 text-gray-700"
            >
              <span title={challenge}>{challenge}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No challenges reported yet.</p>
      )}
    </div>
  );
}
