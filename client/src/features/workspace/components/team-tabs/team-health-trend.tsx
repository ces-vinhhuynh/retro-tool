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

interface TeamHealthTrendProps {
  healthChecks: HealthCheck[];
}

const TeamHealthTrend = ({ healthChecks = [] }: TeamHealthTrendProps) => {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
          Team Health Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartData.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  padding={{ left: 30, right: 30 }}
                  tick={(props) => {
                    const { x, y, payload } = props;
                    const name = payload.value;
                    const displayName =
                      name.length > 12 ? `${name.substring(0, 12)}...` : name;

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
                          fontSize={12}
                        >
                          {displayName}
                        </text>
                      </g>
                    );
                  }}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="linear"
                  dataKey="overall"
                  name="Overall Average"
                  stroke={'#f59e0b'}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="linear"
                  dataKey="delivery"
                  name="Delivery & Execution"
                  stroke={'#4f46e5'}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="linear"
                  dataKey="collaboration"
                  name="Team Collaboration"
                  stroke={'#10b981'}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
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

export default TeamHealthTrend;
