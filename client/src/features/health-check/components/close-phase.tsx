'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  ActionItemWithAssignees,
  HealthCheckWithTemplate,
  Question,
  ResponseWithUser,
  User,
} from '@/features/health-check/types/health-check';

import HealthCheckRating from './health-check-rating';
import ScrumHealthCheck from './scrum-health-check';
import TeamHealthChart from './team-health-chart';

interface ClosePhaseProps {
  healthCheck: HealthCheckWithTemplate;
  questions: Question[];
  responses: ResponseWithUser[];
  actionItems: ActionItemWithAssignees[];
  scrumHealthChecks: HealthCheckWithTemplate[];
  teamSize: number;
  currentUser: User;
  teamMembers: User[];
}

const ClosePhase = ({
  healthCheck,
  questions,
  responses,
  actionItems,
  scrumHealthChecks,
  teamSize,
  currentUser,
  teamMembers,
}: ClosePhaseProps) => {
  return (
    <Card className="mx-auto w-full max-w-7xl lg:w-4/6">
      <CardContent className="flex w-full flex-col gap-2 p-2">
        <TeamHealthChart
          title="Health radar"
          isClosePhase={true}
          responses={responses}
          healthCheck={healthCheck}
          questions={questions}
          actionItems={actionItems}
          teamMembers={teamMembers}
        />
      </CardContent>
      <CardContent className="flex w-full flex-col gap-2 p-2">
        <ScrumHealthCheck scrumHealthChecks={scrumHealthChecks} />
      </CardContent>
      <CardContent className="flex w-full flex-col gap-2 p-2">
        <HealthCheckRating
          teamSize={teamSize}
          responses={responses}
          currentUser={currentUser}
        />
      </CardContent>
    </Card>
  );
};

export default ClosePhase;
