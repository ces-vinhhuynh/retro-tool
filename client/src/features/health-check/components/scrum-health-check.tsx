'use client';

import {
  AverageScores,
  FormattedHealthCheck,
  HealthCheckWithTemplate,
  Response,
  Section,
} from '../types/health-check';
import { getRatings } from '../utils/rating';

import HealthCheckColumn from './health-check-column';
import QuestionRow from './question-row';

interface ScrumHealthCheckProps {
  scrumHealthChecks: HealthCheckWithTemplate[];
  scrumResponses: Response[];
  isShowAddNew?: boolean;
}

const ScrumHealthCheck = ({
  scrumHealthChecks,
  scrumResponses,
  isShowAddNew = false,
}: ScrumHealthCheckProps) => {
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
    return getRatings(
      scrumResponses.filter(
        (response) => response.health_check_id === healthCheckId,
      ),
      questionId,
    );
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

        {formattedData?.map((healthCheck) => (
          <HealthCheckColumn
            key={healthCheck.id}
            healthCheck={healthCheck}
            getHealthCheckRatings={getHealthCheckRatings}
          />
        ))}
        {isShowAddNew && (
          <HealthCheckColumn
            healthCheck={formattedData[0]}
            getHealthCheckRatings={getHealthCheckRatings}
            isShowAddNew={isShowAddNew}
          />
        )}
      </div>
    </div>
  );
};

export default ScrumHealthCheck;
