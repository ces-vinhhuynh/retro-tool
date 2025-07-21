'use client';

import { Users } from 'lucide-react';

import { CircularProgress } from '@/components/progress/circular-progress';
import { Progress } from '@/components/ui/progress';

import { StatCard } from './stat-card';

interface WorkspaceStatCardProps {
  currentAverage: number;
  percentageChange: number;
  teamsCount: number;
  actionItemsInProgress: number;
  actionItemsCompleted: number;
  actionItemsTotal: number;
}

export const WorkspaceStatCard = ({
  currentAverage,
  percentageChange,
  teamsCount,
  actionItemsInProgress,
  actionItemsCompleted,
  actionItemsTotal,
}: WorkspaceStatCardProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard title="Team Health" description="Overall average across teams">
        <div className="flex items-center gap-2">
          <CircularProgress
            value={currentAverage}
            size={70}
            strokeWidth={10}
            showLabel
            labelClassName="text-xl font-bold"
            renderLabel={(progress) => `${progress}%`}
            className="stroke-orange-500/25"
            progressClassName="stroke-orange-600"
          />
          <span
            className={`inline-flex items-center text-sm ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            <span className="mr-1">•</span>
            {percentageChange >= 0 ? '+' : ''}
            {percentageChange}% from last month
          </span>
        </div>
      </StatCard>

      <StatCard title="Active Teams" description="Teams using Health Compass">
        <div className="flex items-center justify-start gap-2">
          <div className="flex items-center gap-3 p-3">
            <div className="rounded-full bg-orange-100 p-2">
              <Users className="h-10 w-10 text-orange-500" />
            </div>
            <div>
              <div className="text-3xl font-bold">{teamsCount}</div>
              <div className="text-muted-foreground text-sm">
                {teamsCount > 1 ? 'Teams' : 'Team'} total
              </div>
            </div>
          </div>
        </div>
      </StatCard>

      <StatCard title="Action Items" description="Tracking completion status">
        <div className="flex flex-col justify-start gap-3">
          <div>
            <div className="flex justify-between gap-3">
              <span className="text-sm">In Progress</span>
              <span className="text-sm">{actionItemsInProgress} tasks</span>
            </div>
            <Progress
              color="red"
              value={
                actionItemsTotal > 0
                  ? (actionItemsInProgress / actionItemsTotal) * 100
                  : 0
              }
              className="h-2 bg-gray-100 [&>div]:bg-yellow-500"
            />
          </div>
          <div>
            <div className="flex justify-between gap-3">
              <span className="text-sm">Completed</span>
              <span className="text-sm">{actionItemsCompleted} tasks</span>
            </div>
            <Progress
              value={
                actionItemsTotal > 0
                  ? (actionItemsCompleted / actionItemsTotal) * 100
                  : 0
              }
              className="h-2 bg-gray-100 [&>div]:bg-green-500"
            />
          </div>
        </div>
      </StatCard>
    </div>
  );
};
