import { useMemo } from 'react';

import {
  getDefaultScoreRange,
  DATA_TRANSFORM_CONSTANTS,
  isValidScore,
  createCacheKey,
} from '../constants/score-range';
import {
  Rating,
  ScoreDistribution,
  QuestionChartData,
  QuestionData,
  ScoreRange,
} from '../types/chart';
import {
  HealthCheckWithTemplate,
  FormattedHealthCheck,
  Section,
  AverageScores,
  Response,
} from '../types/health-check';
import { getRatings } from '../utils/rating';

type TransformedHealthCheckData = {
  healthChecks: FormattedHealthCheck[];
  questionData: QuestionData[];
  scoreRange: ScoreRange;
  getRatings: (healthCheckId: string, questionId: string) => Rating[];
};

export const useHealthCheckTransform = (
  scrumHealthChecks: HealthCheckWithTemplate[],
  scrumResponses: Response[],
): TransformedHealthCheckData => {
  return useMemo(() => {
    if (!scrumHealthChecks?.length) {
      return {
        healthChecks: [],
        questionData: [],
        scoreRange: getDefaultScoreRange(),
        getRatings: () => [],
      };
    }

    // Sort health checks by creation date (oldest first)
    const sortedHealthChecks = [...scrumHealthChecks].sort(
      (a, b) =>
        new Date(a.created_at || '').getTime() -
        new Date(b.created_at || '').getTime(),
    );

    // Create formatted health checks
    const formattedHealthChecks: FormattedHealthCheck[] =
      sortedHealthChecks.map((healthCheck) => ({
        id: healthCheck.id,
        title: healthCheck.title,
        createdAt: healthCheck.created_at,
        status: healthCheck.status,
        questions:
          healthCheck?.template?.questions
            ?.filter(
              (question) => question?.section !== Section.AdditionalQuestions,
            )
            ?.map((question) => ({
              id: question.id,
              title: question.title,
              description: question.description,
              averageScore:
                (healthCheck?.average_score as AverageScores)?.[question.id]
                  ?.average_score ||
                DATA_TRANSFORM_CONSTANTS.INITIAL_VOTE_COUNT,
            })) || [],
      }));

    // Create caching layer for ratings
    const ratingsCache = new Map<string, Rating[]>();
    const getRatingsCached = (
      healthCheckId: string,
      questionId: string,
    ): Rating[] => {
      const key = createCacheKey(healthCheckId, questionId);
      if (!ratingsCache.has(key)) {
        const ratings = scrumResponses
          ? getRatings(
              scrumResponses.filter(
                (response) => response.health_check_id === healthCheckId,
              ),
              questionId,
            )
          : [];
        ratingsCache.set(key, ratings);
      }
      return ratingsCache.get(key)!;
    };

    // Determine score range from actual data
    const scoreRange = determineScoreRange(
      formattedHealthChecks,
      getRatingsCached,
    );

    // Build question data for visualization
    const questionData = buildQuestionData(
      formattedHealthChecks,
      scoreRange,
      getRatingsCached,
    );

    return {
      healthChecks: formattedHealthChecks,
      questionData,
      scoreRange,
      getRatings: getRatingsCached,
    };
  }, [scrumHealthChecks, scrumResponses]);
};

function determineScoreRange(
  healthChecks: FormattedHealthCheck[],
  getRatings: (healthCheckId: string, questionId: string) => Rating[],
): ScoreRange {
  const allScores = new Set<number>();

  // Collect all unique scores from the data
  healthChecks.forEach((healthCheck) => {
    healthCheck.questions?.forEach((question) => {
      const ratings = getRatings(healthCheck.id, question.id);
      ratings.forEach(({ score }) => {
        if (isValidScore(score)) {
          allScores.add(score);
        }
      });
    });
  });

  // Return dynamic range if data exists, otherwise use default 1-10 range
  if (allScores.size > 0) {
    const scoresArray = Array.from(allScores).sort((a, b) => a - b);
    return {
      min: Math.min(...scoresArray),
      max: Math.max(...scoresArray),
      scores: scoresArray,
    };
  }

  return getDefaultScoreRange();
}

/**
 * Builds question data with chart information for visualization
 */
function buildQuestionData(
  healthChecks: FormattedHealthCheck[],
  scoreRange: ScoreRange,
  getRatings: (healthCheckId: string, questionId: string) => Rating[],
): QuestionData[] {
  const questionMap = new Map<string, QuestionData>();

  // Single pass through all health checks and questions
  healthChecks.forEach((healthCheck) => {
    healthCheck.questions?.forEach((question) => {
      // Initialize question data if it doesn't exist
      if (!questionMap.has(question.id)) {
        questionMap.set(question.id, {
          id: question.id,
          title: question.title,
          description: question.description,
          chartData: [],
        });
      }

      const questionDataItem = questionMap.get(question.id)!;
      const ratings = getRatings(healthCheck.id, question.id);

      // Calculate score distribution and metrics
      const { distribution, totalVotes } = calculateScoreDistribution(
        ratings,
        scoreRange,
      );

      // Create chart data point
      const chartDataPoint: QuestionChartData = {
        sprint: healthCheck.title,
        date: healthCheck.createdAt,
        average: question.averageScore,
        distribution,
        totalVotes,
      };

      questionDataItem.chartData.push(chartDataPoint);
    });
  });

  return Array.from(questionMap.values());
}

function calculateScoreDistribution(
  ratings: Rating[],
  scoreRange: ScoreRange,
): {
  distribution: ScoreDistribution;
  totalVotes: number;
} {
  // Initialize distribution with all possible scores
  const distribution: ScoreDistribution = {};
  scoreRange.scores.forEach((score) => {
    distribution[score] = DATA_TRANSFORM_CONSTANTS.INITIAL_VOTE_COUNT;
  });

  // Calculate vote distribution
  let totalVotes = DATA_TRANSFORM_CONSTANTS.INITIAL_VOTE_COUNT;
  ratings.forEach(({ score, count }) => {
    if (scoreRange.scores.includes(score)) {
      distribution[score] = count;
      totalVotes += count;
    }
  });

  return {
    distribution,
    totalVotes,
  };
}
