'use client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ActionItem,
  HealthCheckWithTemplate,
  Question,
  Response,
  ResponseWithUser,
  User,
} from '@/features/health-check/types/health-check';

import { HealthCheckRating } from './health-check-rating';
import ScrumHealthCheck from './scrum-health-check';
import TeamHealthChart from './team-health-chart';

interface ClosePhaseProps {
  healthCheck: HealthCheckWithTemplate;
  questions: Question[];
  responses: ResponseWithUser[];
  actionItems: ActionItem[];
  scrumHealthChecks: HealthCheckWithTemplate[];
  scrumResponses: Response[];
  teamSize: number;
  currentUser: User;
  handleCompleteHealthCheck: () => void;
}
export default function ClosePhase({
  healthCheck,
  questions,
  responses,
  actionItems,
  scrumHealthChecks,
  scrumResponses,
  teamSize,
  currentUser,
  handleCompleteHealthCheck,
}: ClosePhaseProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <Card className="mx-auto w-full max-w-7xl lg:w-3/4">
        <CardContent className="flex flex-col gap-2 p-2">
          <TeamHealthChart
            title="Health radar"
            isClosePhase={true}
            responses={responses}
            healthCheck={healthCheck}
            questions={questions}
            actionItems={actionItems}
          />
        </CardContent>
      </Card>

      <Card className="mx-auto w-full max-w-7xl lg:w-3/4">
        <CardContent className="flex flex-col gap-2 p-2">
          <ScrumHealthCheck
            scrumHealthChecks={scrumHealthChecks}
            scrumResponses={scrumResponses}
          />
        </CardContent>
      </Card>

      <Card className="mx-auto w-full max-w-7xl lg:w-4/6">
        <CardContent className="flex flex-col gap-2 p-2">
          <HealthCheckRating
            teamSize={teamSize}
            responses={responses}
            currentUser={currentUser}
          />
        </CardContent>
      </Card>
      {currentUser.id === healthCheck.facilitator_id && (
        <div className="mx-auto flex w-[10%] py-5">
          <Button
            onClick={() => {
              handleCompleteHealthCheck();
              router.push(`/teams/${healthCheck.team_id}`);
            }}
          >
            Exit Health Check
          </Button>
        </div>
      )}
    </div>
  );
}
