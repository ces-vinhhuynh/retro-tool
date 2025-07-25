'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { TopChallenges } from '@/features/health-check/components/challenges';
import { HealthCheckQuestions } from '@/features/health-check/components/health-check-questions';
import { TeamHealthChart } from '@/features/health-check/components/team-health-chart';
import {
  ActionItemWithAssignees,
  HealthCheckWithTemplate,
  Question,
  Response,
  User,
} from '@/features/health-check/types/health-check';

interface DiscussPhaseProps {
  healthCheck: HealthCheckWithTemplate;
  questions: Question[];
  responses: Response[];
  actionItems: ActionItemWithAssignees[];
  teamMembers: User[];
  isAdmin?: boolean;
  handleQuestionClick: (index: number) => void;
}

export const DiscussPhase = ({
  healthCheck,
  questions,
  responses,
  actionItems,
  teamMembers,
  isAdmin = false,
  handleQuestionClick,
}: DiscussPhaseProps) => {
  const [allOpen, setAllOpen] = useState(false);

  return (
    <>
      <TeamHealthChart
        isClosePhase={false}
        title="Team Health Summary"
        responses={responses}
        healthCheck={healthCheck}
        questions={questions}
        actionItems={actionItems}
        teamMembers={teamMembers}
      />
      <div className="flex flex-col gap-3 rounded-lg bg-white p-2 sm:p-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Discussion Topics
            </h2>
            <p className="text-gray-500">
              Review feedback and comments from the team
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4 flex h-10 items-center gap-2 self-start px-4"
            onClick={() => setAllOpen((open) => !open)}
          >
            {allOpen ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Collapse all
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Expand all
              </>
            )}
          </Button>
        </div>
        <HealthCheckQuestions
          teamMembers={teamMembers}
          responses={responses}
          questions={questions}
          allOpen={allOpen}
          actionItems={actionItems}
          healthCheck={healthCheck}
          handleQuestionClick={handleQuestionClick}
        />
        <TopChallenges
          questions={questions}
          responses={responses}
          healthCheck={healthCheck}
          actionItems={actionItems}
          teamMembers={teamMembers}
          isAdmin={isAdmin}
        />
      </div>
    </>
  );
};
