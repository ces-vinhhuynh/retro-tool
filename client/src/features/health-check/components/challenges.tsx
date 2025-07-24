'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  ActionItemWithAssignees,
  Challenge,
  HealthCheck,
  Question,
  Response,
  Section,
  User,
} from '@/features/health-check/types/health-check';
import {
  getCommentsByQuestionId,
  getTopChallenges,
} from '@/features/health-check/utils/comment';

import { useMoveTagAdditionalAnswer } from '../hooks/use-response';
import { generateTagColors } from '../utils/color';

import { ChartDialog } from './chart-dialog';
import { TagDropdown } from './tag-dropdown';

interface TopChallengesProps {
  responses: Response[];
  questions: Question[];
  healthCheck: HealthCheck;
  actionItems: ActionItemWithAssignees[];
  teamMembers: User[];
  isAdmin?: boolean;
}

export const TopChallenges = ({
  responses,
  questions,
  healthCheck,
  actionItems,
  teamMembers,
  isAdmin = false,
}: TopChallengesProps) => {
  const [selectedTags, setSelectedTags] = useState<Record<string, string>>({});
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const challenges = getTopChallenges(responses, questions);
  const { mutate: moveTagAdditionalAnswer } = useMoveTagAdditionalAnswer();
  const regularQuestions = questions.filter(
    ({ section }) => section !== Section.AdditionalQuestions,
  );
  const tagColors = generateTagColors(regularQuestions.length);

  const addtionalQuestion = (challenge: Challenge) => {
    const { title = '', description = '' } =
      questions.find(({ id }) => id === challenge.additionalQuestionId) ?? {};

    return {
      id: challenge.additionalQuestionId,
      subject: title,
      description,
      comments: getCommentsByQuestionId(
        responses,
        challenge.additionalQuestionId,
      ),
      value: 0,
      fullTitle: title,
    };
  };

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

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setDialogOpen(true);
  };

  return (
    <div>
      {Object.keys(challenges).map((question) => (
        <div key={question}>
          <div className="flex items-center justify-between py-6">
            <h3 className="text-2xl font-bold text-gray-900">{question}</h3>
          </div>

          {challenges[question].length > 0 ? (
            <ul className="animate-fade-in space-y-2">
              {challenges[question].map((challenge, index) => {
                const challengeKey = uuidv4();
                return (
                  <li
                    key={challengeKey}
                    className="flex flex-col items-center justify-between rounded bg-orange-50 px-3 py-2 text-gray-700 sm:flex-row"
                  >
                    <Button
                      variant="ghost"
                      className="w-full max-w-7xl flex-1 justify-start truncate hover:bg-transparent"
                      onClick={() => handleChallengeClick(challenge)}
                    >
                      <span className="truncate">{challenge.text}</span>
                    </Button>
                    <span className="ml-4 self-end sm:self-center">
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
      ))}
      {selectedChallenge && (
        <ChartDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          data={[addtionalQuestion(selectedChallenge)]}
          actionItems={actionItems}
          currentIndex={0}
          onCurrentIndexChange={() => {}}
          healthCheck={healthCheck}
          teamMembers={teamMembers}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};
