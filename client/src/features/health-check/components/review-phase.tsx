import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';

import {
  ActionItemWithAssignees,
  HealthCheckWithTemplate,
  User,
} from '../types/health-check';
import { formatDateTime } from '../utils/time-format';

import { ActionItemRow } from './action-item-row';
import ActionItems from './action-items';

interface ReviewPhaseProps {
  healthCheck: HealthCheckWithTemplate;
  actionItems: ActionItemWithAssignees[];
  teamId?: string;
  teamSize: number;
  teamMembers: User[];
}

const ReviewPhase = ({
  actionItems,
  healthCheck,
  teamSize = 0,
  teamId,
  teamMembers,
}: ReviewPhaseProps) => {
  const currentActionItems = actionItems?.filter(
    (item) => item.health_check_id === healthCheck.id,
  );

  const previousActionItems = actionItems?.filter(
    (item) => item.health_check_id !== healthCheck.id,
  );

  return (
    <Card className="mx-auto w-full max-w-7xl lg:w-4/6">
      <CardContent className="space-y-4 p-4 sm:p-8">
        <h3 className="text-lg font-medium">Session Summary</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-1">
            <div className="text-sm text-gray-500">Session Name</div>
            <div className="font-medium">{healthCheck.title}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-500">Date Created</div>
            <div className="font-medium">
              {healthCheck.created_at &&
                formatDateTime(new Date(healthCheck.created_at))}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-500">Status</div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  healthCheck.status === 'done'
                    ? 'bg-green-500'
                    : 'bg-blue-500',
                )}
              />
              <div className="font-medium capitalize">{healthCheck.status}</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-500">Participants</div>
            <div className="font-medium">{teamSize} team members</div>
          </div>
        </div>
      </CardContent>

      <div className="space-y-6 p-4 sm:p-6">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
          <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
          <CardHeader className="pb-2">
            <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
              Team actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-base font-medium text-gray-600">
                Actions from this health check
              </h3>
              <ActionItems
                actionItems={currentActionItems}
                healthCheckId={healthCheck.id}
                teamId={teamId}
                teamMembers={teamMembers}
              />
            </div>
          </CardContent>
        </Card>
        {previousActionItems && (
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
            <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
            <CardContent className="p-8">
              <div className="space-y-4">
                <h2 className="flex items-center gap-2 text-xl font-medium text-gray-600">
                  Actions from the previous Health check
                </h2>
                {previousActionItems?.map((item) => (
                  <ActionItemRow
                    key={item.id}
                    item={item}
                    isEditable={false}
                    teamMembers={teamMembers}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Card>
  );
};

export default ReviewPhase;
