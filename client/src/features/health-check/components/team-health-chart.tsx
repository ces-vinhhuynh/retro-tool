'use client';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import { ChartContainer } from '@/components/ui/chart';
import ScoreMetric from '@/features/health-check/components/score-metric';
import {
  AverageScores,
  Question,
  Response,
  Section,
} from '@/features/health-check/types/health-check';
import {
  calcTotalComments,
  getCommentCount,
  getCommentsByQuestionId,
} from '@/features/health-check/utils/comment';
import {
  calcAverage,
  calcSectionAverage,
} from '@/features/health-check/utils/score';
import { Json } from '@/types/database';
import { cn } from '@/utils/cn';

import ChartDialog from './chart-dialog';

interface TeamHealthChartProps {
  averageScores: Json;
  questions: Question[];
  responses: Response[];
}

export default function TeamHealthChart({
  averageScores,
  questions,
  responses,
}: TeamHealthChartProps) {
  const scores = averageScores as AverageScores;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const overallAvg = calcAverage(questions, scores);
  const deliveryAvg = calcSectionAverage(
    Section.DeliveryExecution,
    questions,
    scores,
  );
  const collabAvg = calcSectionAverage(
    Section.TeamCollaboration,
    questions,
    scores,
  );
  const totalComments = calcTotalComments(responses, questions);

  const chartData = questions
    .filter((q) => q.section !== Section.AdditionalQuestions)
    .map((q) => ({
      id: q.id,
      subject: q.title,
      value: scores[q.id]?.average_score ?? 0,
      fullTitle: `${q.title} (${q.section})`,
      commentCount: getCommentCount(responses, q.id),
      description: q.description,
      comments: getCommentsByQuestionId(responses, q.id),
    }));

  const chartConfig = {
    line1: { theme: { light: '#FEC6A1', dark: '#FEC6A1' } },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPolarAngleAxis = ({ payload, x, y, cx, index }: any) => {
    const subject = payload.value;
    const point = chartData.find((item) => item.subject === subject);
    const commentCount = point?.commentCount ?? 0;

    return (
      <g>
        {commentCount > 0 && (
          <foreignObject
            x={x - 30}
            y={y - 20}
            width="60"
            height="20"
            style={{ overflow: 'visible' }}
          >
            <div
              className={cn(
                'mt-2 flex items-center text-[12px] font-bold text-[#555555]',
                x < cx && 'justify-start',
                x > cx && 'justify-end',
                x === cx && 'justify-center',
              )}
            >
              <MessageSquare size={14} className="mr-1" />
              <span>{commentCount}</span>
            </div>
          </foreignObject>
        )}

        <text
          x={x}
          y={y}
          textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
          fill="#555555"
          fontSize={12}
          onClick={() => handleClick(index)}
          className="cursor-pointer"
        >
          <tspan x={x} dy="1.2em">
            {payload.value}
          </tspan>
        </text>
      </g>
    );
  };

  const handleClick = (index: number) => {
    setSelectedIndex(index);
    setDialogOpen(true);
  };

  return (
    <div className="rounded-lg bg-white p-6">
      <h2 className="text-2xl font-bold text-gray-900">Team Health Summary</h2>
      <p className="text-gray-500">
        Average scores from all participants for health check sprint
      </p>

      <div className="flex items-start gap-4 pt-6">
        <div className="space-y-2">
          <ScoreMetric label="Avg. Score" value={overallAvg} />
          <ScoreMetric label="Avg. Delivery & Execution" value={deliveryAvg} />
          <ScoreMetric label="Avg. Team Collaboration" value={collabAvg} />
        </div>

        <ScoreMetric
          label="Comments"
          value={totalComments}
          unit=""
          colorClass="text-[#9b87f5]"
        />
      </div>

      <div className="h-[400px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#f0cab6" strokeWidth={1} />
            <PolarAngleAxis
              dataKey="subject"
              tick={renderPolarAngleAxis}
              stroke="none"
              fontSize={12}
              tickLine={false}
            />
            <Radar
              name="Team Health"
              dataKey="value"
              stroke="#FEC6A1"
              strokeWidth={1}
              fill="#FEC6A1"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ChartContainer>
        {dialogOpen && (
          <ChartDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            data={chartData}
            currentIndex={selectedIndex}
            setCurrentIndex={setSelectedIndex}
          />
        )}
      </div>
    </div>
  );
}
