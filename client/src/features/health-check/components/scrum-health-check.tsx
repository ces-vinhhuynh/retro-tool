'use client';

import { useState } from 'react';

import { cn } from '@/utils/cn';

import {
  AverageScores,
  FormattedHealthCheck,
  HealthCheckWithTemplate,
  Response,
  Section,
} from '../types/health-check';
import { getScoreColors } from '../utils/color';
import { getRatings } from '../utils/rating';
import { formatDateTime } from '../utils/time-format';

import QuestionRow from './question-row';
import ScoreTooltip from './rating-tooltip';

interface ScrumHealthCheckProps {
  scrumHealthChecks: HealthCheckWithTemplate[];
  scrumResponses: Response[];
}

export default function ScrumHealthCheck({
  scrumHealthChecks,
  scrumResponses,
}: ScrumHealthCheckProps) {
  const [hoveredScore, setHoveredScore] = useState<{
    questionId: string;
    healthCheckId: string;
  } | null>(null);

  const formattedData: FormattedHealthCheck[] = scrumHealthChecks?.map(
    (healthCheck) => ({
      id: healthCheck.id,
      title: healthCheck.title,
      createdAt: healthCheck.created_at,
      status: healthCheck.status,
      questions: healthCheck.template.questions
        .filter((question) => question.section !== Section.AdditionalQuestions)
        .map((question) => ({
          id: question.id,
          title: question.title,
          description: question.description,
          averageScore:
            (healthCheck?.average_score as AverageScores)?.[question.id]
              ?.average_score || 0,
        })),
    }),
  );

  if (!formattedData?.length) {
    return null;
  }

  const getHealthCheckRatings = (healthCheckId: string, questionId: string) => {
    if (!scrumResponses) return [];

    const healthCheckResponses = scrumResponses.filter(
      (response) => response.health_check_id === healthCheckId,
    );

    return getRatings(healthCheckResponses, questionId);
  };

  return (
    <div className="rounded-lg bg-white p-6">
      <h2 className="py-3 text-2xl font-bold text-gray-900">
        Scrum Health Check
      </h2>
      <div className="flex w-full flex-row gap-0 border-gray-200 md:flex-nowrap">
        <div className="w-[120px] shrink-0 sm:w-[160px] md:w-[220px]">
          <div className="h-24 border-r border-b border-gray-200" />
          {formattedData[0].questions.map((item, index) => (
            <QuestionRow
              key={item.id}
              title={item.title}
              description={item.description}
              isFirst={index === 0}
            />
          ))}
        </div>

        {formattedData?.map((healthCheck, checkIndex) => (
          <div
            key={checkIndex}
            className="flex w-[100px] flex-col border transition-transform duration-200 hover:scale-105 sm:w-[140px] md:w-[210px]"
          >
            <div className="flex h-24 flex-col items-center justify-center gap-1 border-b bg-gray-50">
              <h2 className="text-lg font-bold">{healthCheck.title}</h2>
              <p className="text-sm text-gray-500">
                {formatDateTime(new Date(String(healthCheck?.createdAt)))}
              </p>
              <div className="rounded bg-gray-200 px-2 text-xs capitalize">
                {healthCheck.status}
              </div>
            </div>
            {healthCheck.questions.map((item) => {
              const { bg } = getScoreColors(item.averageScore);
              const ratings = getHealthCheckRatings(healthCheck.id, item.id);
              const hasScore = item.averageScore > 0;

              return (
                <div
                  key={item.id}
                  className={cn(
                    'relative flex h-16 items-center justify-center border-gray-200',
                    bg,
                  )}
                  onMouseEnter={() =>
                    setHoveredScore({
                      questionId: item.id,
                      healthCheckId: healthCheck.id,
                    })
                  }
                  onMouseLeave={() => setHoveredScore(null)}
                >
                  <span
                    className={cn(
                      'text-xl font-bold',
                      !hasScore && 'text-gray-400',
                    )}
                  >
                    {hasScore ? item.averageScore.toFixed(1) : '-'}
                  </span>

                  {hoveredScore?.questionId === item.id &&
                    hoveredScore?.healthCheckId === healthCheck.id &&
                    (ratings.length > 0 ? (
                      <ScoreTooltip ratings={ratings} />
                    ) : (
                      <div className="absolute bottom-full left-1/2 w-auto -translate-x-1/2">
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
        ))}
      </div>
    </div>
  );
}
