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
import {
  Section,
  HealthCheck,
  HealthCheckWithTemplate,
  AverageScores,
  Question,
} from '@/features/health-check/types/health-check';
import {
  calcAverage,
  calcSectionAverage,
} from '@/features/health-check/utils/score';
import { cn } from '@/lib/utils';

interface TeamHealthTrendProps {
  healthChecks: HealthCheck[];
  isMobile: boolean;
}

export const TeamHealthTrend = ({
  healthChecks = [],
  isMobile = false,
}: TeamHealthTrendProps) => {
  const chartData = useMemo(() => {
    if (!healthChecks?.length) return [];

    return healthChecks
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      })
      .map((check) => {
        const scores = check.average_score
          ? (check.average_score as unknown as AverageScores)
          : {};

        const templateCheck = check as unknown as HealthCheckWithTemplate;
        const questions: Question[] = templateCheck.template?.questions || [];

        const deliveryScore = questions.length
          ? parseFloat(
              calcSectionAverage(Section.DeliveryExecution, questions, scores),
            )
          : 0;

        const collaborationScore = questions.length
          ? parseFloat(
              calcSectionAverage(Section.TeamCollaboration, questions, scores),
            )
          : 0;

        const overallScore = questions.length
          ? parseFloat(calcAverage(questions, scores))
          : 0;

        return {
          name:
            check.title ||
            new Date(check.created_at || '').toLocaleDateString(),
          delivery: deliveryScore,
          collaboration: collaborationScore,
          overall: overallScore,
          checkId: check.id,
          date: check.created_at,
        };
      });
  }, [healthChecks]);

  // Define line configurations
  const lineConfigs = [
    {
      key: 'overall',
      name: 'Overall Project Health',
      color: '#f59e0b',
      strokeWidth: 3,
    },
    {
      key: 'delivery',
      name: 'Delivery & Execution Score',
      color: '#4f46e5',
      strokeWidth: 2,
    },
    {
      key: 'collaboration',
      name: 'Team & Process Score',
      color: '#10b981',
      strokeWidth: 2,
    },
  ];

  // Calculate legend height based on number of lines and mobile/desktop
  const calculateLegendHeight = () => {
    const lineCount = lineConfigs.length;

    if (isMobile) {
      // On mobile, more likely to wrap to multiple lines
      return Math.max(45, lineCount * 22 + 16);
    } else {
      const rows = Math.ceil(lineCount / 2);
      return Math.max(35, rows * 20 + 12);
    }
  };

  // Calculate dynamic heights
  const legendHeight = calculateLegendHeight();
  const chartHeight = 400;
  const totalHeight = chartHeight + legendHeight;

  // Custom Legend Component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomLegend = (props: any) => {
    const { payload } = props;
    if (!payload || payload.length === 0) return null;

    return (
      <div
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-2 md:px-4"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `${legendHeight}px`,
          display: 'flex',
          alignItems: 'center',
          paddingBottom: '4px',
        }}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="h-2 w-4 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span
              className="text-xs leading-tight font-medium sm:text-sm"
              style={{
                color: entry.color,
              }}
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
      <CardHeader className={cn('p-6 pt-3 pb-0 md:p-6')}>
        <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
          Team Health Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="px-1 pt-3 pb-3 md:px-6 md:pt-6">
        {chartData.length > 0 ? (
          <div
            className="relative w-full"
            style={{ height: `${totalHeight}px` }}
          >
            {/* Custom Legend Container */}
            <div
              className="relative w-full"
              style={{ height: `${legendHeight}px` }}
            >
              <CustomLegend
                payload={lineConfigs.map((config) => ({
                  value: config.name,
                  color: config.color,
                }))}
              />
            </div>

            {/* Chart Container */}
            <div className="w-full" style={{ height: `${chartHeight}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                    right: isMobile ? 10 : 30,
                    left: isMobile ? 10 : 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickMargin={8}
                    angle={-45}
                    textAnchor="end"
                    padding={{
                      left: isMobile ? 10 : 30,
                      right: isMobile ? 10 : 30,
                    }}
                    tick={(props) => {
                      const { x, y, payload } = props;
                      const name = payload.value;
                      const maxLength = isMobile ? 8 : 12;
                      const displayName =
                        name.length > maxLength
                          ? `${name.substring(0, maxLength)}...`
                          : name;

                      return (
                        <g transform={`translate(${x},${y})`}>
                          <title>{name}</title>
                          <text
                            x={0}
                            y={0}
                            dy={16}
                            textAnchor="end"
                            fill="#666"
                            transform="rotate(-45)"
                            fontSize={isMobile ? 10 : 12}
                          >
                            {displayName}
                          </text>
                        </g>
                      );
                    }}
                  />
                  <YAxis domain={[0, 10]} width={isMobile ? 30 : 60} />
                  <Tooltip />
                  {lineConfigs.map((config) => (
                    <Line
                      key={config.key}
                      type="linear"
                      dataKey={config.key}
                      name={config.name}
                      stroke={config.color}
                      strokeWidth={config.strokeWidth}
                      dot={{ r: isMobile ? 3 : 4 }}
                      activeDot={{ r: isMobile ? 5 : 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center text-center">
            <p className="text-muted-foreground">
              No health check data available for trend analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
