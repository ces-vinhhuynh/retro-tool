'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthCheck } from '@/features/health-check/types/health-check';
import { Template } from '@/features/health-check/types/templates';
import { Team } from '@/types/team';

import { TEAM_COLORS } from '../utils/constant';
import { getWorkspaceHealthTrendChartData } from '../utils/workspace-metrics';

interface WorkspaceHealthTrendProps {
  healthChecks: HealthCheck[];
  templates: Template[];
  teams: Team[];
}

const WorkspaceHealthTrend = ({
  healthChecks = [],
  templates = [],
  teams = [],
}: WorkspaceHealthTrendProps) => {
  const chartData = useMemo(
    () => getWorkspaceHealthTrendChartData(healthChecks, templates, teams),
    [healthChecks, templates, teams],
  );

  const getTeamColor = (index: number) =>
    TEAM_COLORS[index % TEAM_COLORS.length];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
          All Project Teams Health Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartData.length > 0 ? (
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                  padding={{ left: 30, right: 30 }}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    name,
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: '20px' }}
                />
                {teams.map((team, index) => (
                  <Line
                    key={team.id}
                    type="linear"
                    dataKey={team.name}
                    name={team.name}
                    stroke={getTeamColor(index)}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center text-center">
            <div>
              <p className="text-muted-foreground mb-2">
                No health check data available for trend analysis
              </p>
              <p className="text-sm text-gray-500">
                Start conducting health checks to see trends appear here
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkspaceHealthTrend;
