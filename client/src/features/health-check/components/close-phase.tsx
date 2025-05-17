import { Card, CardContent } from '@/components/ui/card';
import {
  ActionItem,
  HealthCheckWithTemplate,
  Question,
  Response,
  ResponseWithUser,
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
}
export default function ClosePhase({
  healthCheck,
  questions,
  responses,
  actionItems,
  scrumHealthChecks,
  scrumResponses,
  teamSize,
}: ClosePhaseProps) {
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

      <Card className="mx-auto w-full max-w-7xl lg:w-3/4">
        <CardContent className="flex flex-col gap-2 p-2">
          <HealthCheckRating teamSize={teamSize} responses={responses} />
        </CardContent>
      </Card>
    </div>
  );
}
