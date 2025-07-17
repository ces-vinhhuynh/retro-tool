'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  isMobile: boolean;
}

const WorkspaceHealthTrend = ({
  healthChecks = [],
  templates = [],
  teams = [],
  isMobile = false,
}: WorkspaceHealthTrendProps) => {
  const chartData = useMemo(
    () => getWorkspaceHealthTrendChartData(healthChecks, templates, teams),
    [healthChecks, templates, teams],
  );

  const getTeamColor = (index: number) =>
    TEAM_COLORS[index % TEAM_COLORS.length];

  // Calculate legend height based on number of teams
  const calculateLegendHeight = (teamCount: number) => {
    // Assume each legend item takes about 120px width on average
    const itemWidth = 120;
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const availableWidth = containerWidth - 100;
    
    const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth));
    const rows = Math.ceil(teamCount / itemsPerRow);
    
    return Math.max(40, rows * 24 + 16); // Min 40px, each row ~24px + padding
  };

  // Calculate dynamic heights
  const legendHeight = calculateLegendHeight(teams.length);
  const chartHeight = Math.max(400, 500 + (teams.length > 10 ? (teams.length - 10) * 5 : 0));

  // Custom Legend Component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomLegend = (props: any) => {
    const { payload } = props;
    if (!payload || payload.length === 0) return null;

    return (
      <div 
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `${legendHeight}px`,
          display: 'flex',
          alignItems: 'center',
          paddingBottom: '20px'
        }}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="h-2 w-4 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span 
              className="text-xs font-medium sm:text-sm"
              style={{ color: entry.color ,
                fontSize: isMobile ? '12px' : '14px',
                lineHeight: isMobile ? '14px' : '16px'}}
            >
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
          All Project Teams Health Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 sm:pt-6">
        {chartData.length > 0 ? (
          <div 
            className="w-full relative"
            style={{ height: `${chartHeight}px` }}
          >
            {/* Custom Legend Container */}
            <div 
              className="relative w-full"
              style={{ height: `${legendHeight}px` }}
            >
              <CustomLegend 
                payload={teams.map((team, index) => ({
                  value: team.name,
                  color: getTeamColor(index),
                }))}
              />
            </div>

            {/* Chart Container */}
            <div 
              className="w-full"
              style={{ height: `${chartHeight - legendHeight}px` }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ 
                    top: 20, 
                    right: 30, 
                    left: 20, 
                    bottom: 60 
                  }}
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
                  <YAxis domain={[0, 100]} width={isMobile ? 30 : 60} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value}%`,
                      name,
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
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