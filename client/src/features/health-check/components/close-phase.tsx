import { Card, CardContent } from '@/components/ui/card';
import {
  ActionItem,
  HealthCheckWithTemplate,
  Question,
  Response,
} from '@/features/health-check/types/health-check';

import ScrumHealthCheck from './scrum-health-check';
import TeamHealthChart from './team-health-chart';

interface ClosePhaseProps {
  healthCheck: HealthCheckWithTemplate;
  questions: Question[];
  responses: Response[];
  actionItems: ActionItem[];
  scrumHealthChecks: HealthCheckWithTemplate[];
  scrumResponses: Response[];
}
export default function ClosePhase({
  healthCheck,
  questions,
  responses,
  actionItems,
  scrumHealthChecks,
  scrumResponses,
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
    </div>
  );
}
