'use client';

import { CardContent } from '@/components/ui/card';
import {
  ActionItemWithAssignees,
  HealthCheckWithTemplate,
  Question,
  ResponseWithUser,
  User,
} from '@/features/health-check/types/health-check';

import { HealthCheckRating } from './health-check-rating';
import { ScrumHealthCheck } from './scrum-health-check';
import { TeamHealthChart } from './team-health-chart';

interface ClosePhaseProps {
  healthCheck: HealthCheckWithTemplate;
  questions: Question[];
  responses: ResponseWithUser[];
  actionItems: ActionItemWithAssignees[];
  scrumHealthChecks: HealthCheckWithTemplate[];
  teamSize: number;
  currentUser: User;
  teamMembers: User[];
  isAdmin?: boolean;
}

export const ClosePhase = ({
  healthCheck,
  questions,
  responses,
  actionItems,
  scrumHealthChecks,
  teamSize,
  currentUser,
  teamMembers,
  isAdmin = false,
}: ClosePhaseProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <CardContent className="hidden flex-col gap-2 p-2 sm:flex">
        <TeamHealthChart
          title="Health radar"
          isClosePhase={true}
          isAdmin={isAdmin}
          responses={responses}
          healthCheck={healthCheck}
          questions={questions}
          actionItems={actionItems}
          teamMembers={teamMembers}
        />
      </CardContent>
      <CardContent className="hidden w-full flex-col gap-2 p-2 sm:flex">
        <ScrumHealthCheck scrumHealthChecks={scrumHealthChecks} />
      </CardContent>
      <CardContent className="flex w-full flex-col gap-2 p-2">
        <HealthCheckRating
          teamSize={teamSize}
          responses={responses}
          currentUser={currentUser}
        />
      </CardContent>
    </div>
  );
};
