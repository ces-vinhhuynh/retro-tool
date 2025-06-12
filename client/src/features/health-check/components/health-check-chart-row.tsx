'use client';

import { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

import { cn } from '@/utils/cn';

import { QuestionData, ScoreRange } from '../types/chart';
import { getScoreColors } from '../utils/color';
import { getScorePercentage } from '../utils/score';

import QuestionRow from './question-row';
import ScoreTooltip from './rating-tooltip';

interface HealthCheckChartRowProps {
  question: QuestionData;
  scoreRange: ScoreRange;
  healthCheckCount: number;
  isShowAddNew?: boolean;
  getRatings?: (
    healthCheckId: string,
    questionId: string,
  ) => Array<{ score: number; count: number }>;
}

const HealthCheckChartRow = ({
  question,
  scoreRange,
  healthCheckCount: _healthCheckCount,
  isShowAddNew = false,
  getRatings,
}: HealthCheckChartRowProps) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  // Build chartData: one entry per health check (sprint), zeros for missing scores
  const chartData = question.chartData.map((data) => {
    const hasScores = data.totalVotes > 0;
    return {
      sprint: data.sprint,
      date: data.date,
      totalVotes: data.totalVotes,
      average: data.average,
      ...Object.fromEntries(
        scoreRange.scores.map((score) => [
          `score${score}`,
          hasScores ? data.distribution[score] || 0 : 0,
        ]),
      ),
    };
  });

  const getHealthCheckId = (index: number) => {
    return question.chartData[index]?.sprint || '';
  };

  return (
    <div className="relative overflow-visible border-t border-b border-gray-200">
      <div className="flex">
        <QuestionRow
          title={question.title}
          description={question.description}
          isShowAddNew={isShowAddNew}
        />

        <div className="relative w-full flex-1 overflow-visible">
          <div className="relative h-16">
            {/* Single AreaChart for the entire row */}
            <div className="absolute inset-0 h-full w-full">
              {chartData.length === 1 ? (
                <div className="absolute inset-0 flex h-full w-full flex-col">
                  {scoreRange.scores
                    .slice()
                    .reverse()
                    .map((score) => {
                      const percentage = getScorePercentage(
                        chartData[0],
                        score,
                      );
                      return (
                        percentage > 0 && (
                          <div
                            key={score}
                            className="w-full"
                            style={{
                              height: `${percentage}%`,
                              backgroundColor: getScoreColors(score)
                                .circle.replace('bg-[', '')
                                .replace(']', ''),
                            }}
                          />
                        )
                      );
                    })}
                </div>
              ) : (
                // Multiple health checks: render AreaChart
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    stackOffset="expand"
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    {scoreRange.scores.slice().map((score) => (
                      <Area
                        key={score}
                        type="natural"
                        dataKey={`score${score}`}
                        stackId="1"
                        stroke="none"
                        fill={getScoreColors(score)
                          .circle.replace('bg-[', '')
                          .replace(']', '')}
                        fillOpacity={0.8}
                        isAnimationActive={false}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Grid overlay for tooltips and values */}
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${chartData.length}, 1fr)`,
              }}
            >
              {chartData.map((data, index) => {
                const ratings = getRatings
                  ? getRatings(getHealthCheckId(index), question.id)
                  : [];
                const hasData = data.totalVotes > 0 && data.average > 0;

                return (
                  <div
                    key={`cell-${index}`}
                    className="relative flex h-full cursor-pointer items-center justify-center border-r border-gray-300 last:border-r-0"
                    onMouseEnter={() => setHoveredCell(index)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {hasData && (
                      <span
                        className={cn(
                          'relative z-10 font-bold text-white drop-shadow-lg',
                          'text-sm sm:text-base lg:text-lg xl:text-xl',
                        )}
                      >
                        {data.average.toFixed(1)}
                      </span>
                    )}

                    {hoveredCell === index &&
                      (ratings.length > 0 ? (
                        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-auto -translate-x-1/2">
                          <ScoreTooltip ratings={ratings} />
                        </div>
                      ) : (
                        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-auto -translate-x-1/2">
                          <div className="flex rounded-lg border bg-white p-3 shadow-lg">
                            <span className="text-sm text-gray-600">
                              No ratings yet
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {isShowAddNew && (
          <div className="h-16 w-24 flex-shrink-0 border-r border-gray-200 bg-blue-50 sm:w-32 lg:w-40" />
        )}
      </div>
    </div>
  );
};

export default HealthCheckChartRow;
