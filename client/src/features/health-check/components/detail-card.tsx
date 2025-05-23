'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ActionItems from '@/features/health-check/components/action-items';
import SurveyResponses from '@/features/health-check/components/survey-responses';
import {
  ActionItem,
  HealthCheck,
  User,
} from '@/features/health-check/types/health-check';
import { scoreColorMap } from '@/features/health-check/utils/color';
import { cn } from '@/utils/cn';

interface DetailCardProps {
  item: {
    id: string;
    subject: string;
    value: number;
    fullTitle: string;
    description: string;
    comments: { comment: string; created_at: string }[];
  };
  actionItems: ActionItem[];
  healthCheck: HealthCheck;
  teamMembers: User[];
}
export default function DetailCard({
  item,
  actionItems,
  healthCheck,
  teamMembers,
}: DetailCardProps) {
  const roundedValue = Math.max(0, Math.min(10, Math.round(item.value)));
  const { bg, circle } = scoreColorMap[roundedValue] || scoreColorMap[0];

  return (
    <Card
      className={cn(
        'border-0 shadow-none',
        bg,
        'absolute inset-0 inset-y-auto min-h-full px-4',
      )}
    >
      <CardHeader>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-17 w-17 items-center justify-center self-center rounded-full px-3',
              circle,
            )}
          >
            <span className="text-4xl font-bold text-white">
              {Number(item.value).toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col gap-2 self-center">
            <CardTitle className="text-xl">{item.subject}</CardTitle>
            <p>{item.description}</p>
          </div>
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
}
