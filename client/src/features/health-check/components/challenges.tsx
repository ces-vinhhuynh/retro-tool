'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  Challenge,
  Question,
  Response,
} from '@/features/health-check/types/health-check';
import { getTopChallenges } from '@/features/health-check/utils/comment';

import { useMoveTagAdditionalAnswer } from '../hooks/use-response';
import { generateTagColors } from '../utils/color';

import TagDropdown from './tag-dropdown';

interface TopChallengesProps {
  responses: Response[];
  questions: Question[];
}

export default function TopChallenges({
  responses,
  questions,
}: TopChallengesProps) {
  const [selectedTags, setSelectedTags] = useState<Record<string, string>>({});
  const challenges = getTopChallenges(responses, questions);
  const { mutate: moveTagAdditionalAnswer } = useMoveTagAdditionalAnswer();
  const regularQuestions = questions.filter(
    (q) => q.section !== 'Additional Questions',
  );
  const tagColors = generateTagColors(regularQuestions.length);

  const tags = [
    {
      id: 'TBD',
      title: 'TBD',
      ...tagColors.TBD,
    },
    ...regularQuestions.map((question, index) => ({
      id: question.id,
      title: question.title,
      ...tagColors[index + 1],
    })),
  ];

  const handleTagChange = async (
    challenge: Challenge,
    questionId: string,
    index: number,
    challengeKey: string,
  ) => {
    setSelectedTags((prev) => ({
      ...prev,
      [challengeKey]: questionId,
    }));

    moveTagAdditionalAnswer({
      responseId: challenge.response.id,
      additionalQuestionId: challenge.additionalQuestionId,
      questionId: questionId,
      commentText: challenge.text,
      commentIndex: index,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between py-6">
        <h3 className="text-2xl font-bold text-gray-900">Top Challenges</h3>
      </div>

      {challenges.length > 0 ? (
        <ul className="animate-fade-in space-y-2">
          {challenges.map((challenge, index) => {
            const challengeKey = uuidv4();
            return (
              <li
                key={challengeKey}
                className="flex items-center justify-between rounded bg-orange-50 px-3 py-2 text-gray-700"
              >
                <span title={challenge.text}>{challenge.text}</span>
                <span className="ml-4">
                  <TagDropdown
                    tags={tags}
                    onTagChange={(_, questionId) =>
                      handleTagChange(
                        challenge,
                        questionId,
                        index,
                        challengeKey,
                      )
                    }
                    selectedTag={
                      tags.find(
                        (tag) => tag.id === selectedTags[challengeKey],
                      ) || tags[0]
                    }
                  />
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No challenges reported yet.</p>
      )}
    </div>
  );
}
