'use client';
import { CirclePlus } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SurveyResponses from '@/features/health-check/components/survey-responses';
import { scoreColorMap } from '@/features/health-check/utils/color';

interface DetailCardProps {
  item: {
    id: string;
    subject: string;
    value: number;
    fullTitle: string;
    description: string;
    comments: { comment: string; created_at: string }[];
  };
}
export default function DetailCard({ item }: DetailCardProps) {
  const roundedValue = Math.max(0, Math.min(10, Math.round(item.value)));
  const { bg, circle } = scoreColorMap[roundedValue] || scoreColorMap[0];

  return (
    <Card className={`border-0 shadow-none ${bg} absolute inset-0 px-4 py-4`}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div
            className={`flex h-17 w-17 items-center justify-center self-center rounded-full ${circle}`}
          >
            <span className="text-4xl font-bold text-white">
              {Number(item.value).toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col gap-2 self-center">
            <CardTitle className="text-xl">{item.subject}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-8">
        <div className="border-t pt-4">
          <div className="mb-4 rounded-md bg-white p-4">
            <div className="flex items-center gap-2">
              <CirclePlus className="h-5 w-5 text-gray-400" />
              <span className="text-gray-500">Add action...</span>
            </div>
          </div>
          <div className="rounded-md bg-white p-4">
            <p className="text-center text-sm">No actions yet</p>
          </div>
        </div>
        <SurveyResponses comments={item.comments} />
      </CardContent>
    </Card>
  );
}
