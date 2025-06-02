'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ActionItems from '@/features/health-check/components/action-items';
import SurveyResponses from '@/features/health-check/components/survey-responses';
import {
  ActionItemWithAssignees,
  HealthCheck,
  User,
} from '@/features/health-check/types/health-check';
import { scoreColorMap } from '@/features/health-check/utils/color';
import { cn } from '@/utils/cn';
import { roundAndRemoveTrailingZero } from '@/utils/number';

interface DetailCardProps {
  item: {
    id: string;
    subject: string;
    value: number;
    fullTitle: string;
    description: string;
    comments: { comment: string; created_at: string }[];
  };
  actionItems: ActionItemWithAssignees[];
  healthCheck: HealthCheck;
  teamMembers: User[];
}

const DetailCard = ({
  item,
  actionItems,
  healthCheck,
  teamMembers,
}: DetailCardProps) => {
  const roundedValue = Math.max(0, Math.min(10, Math.round(item.value)));
  const { bg, circle } = scoreColorMap[roundedValue] || scoreColorMap[0];

  return (
    <Card
      className={cn(
        'absolute inset-0 inset-y-auto min-h-full border-0 bg-[#dfedcf] px-4 shadow-none',
        item.value > 0 && bg,
      )}
    >
      <CardHeader>
        <div className="flex items-start gap-3">
          {item.value > 0 ? (
            <>
              <div
                className={cn(
                  'flex h-17 w-17 items-center justify-center self-center rounded-full px-3',
                  circle,
                )}
              >
                <span className="text-4xl font-bold text-white">
                  {roundAndRemoveTrailingZero(item.value)}
                </span>
              </div>
              <div className="flex flex-col gap-2 self-center">
                <CardTitle className="text-xl">{item.subject}</CardTitle>
                <p>{item.description}</p>
              </div>
            </>
          ) : (
            <div className="flex w-full flex-col gap-2">
              <CardTitle className="text-xl">{item.subject}</CardTitle>
              <p className="text-gray-600">{item.description}</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="ml-2 w-full border-t py-5">
        <ActionItems
          actionItems={actionItems}
          questionId={item.id}
          healthCheckId={healthCheck.id}
          teamId={String(healthCheck.team_id)}
          teamMembers={teamMembers}
        />
        <SurveyResponses comments={item.comments} />
      </CardContent>
    </Card>
  );
};

export default DetailCard;
