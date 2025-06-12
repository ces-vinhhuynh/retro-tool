// Health Check Score Range Constants
export const SCORE_RANGE_CONSTANTS = {
  MIN_SCORE: 1,
  MAX_SCORE: 10,
  DEFAULT_SCORES: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
} as const;

// Data transformation constants
export const DATA_TRANSFORM_CONSTANTS = {
  CACHE_KEY_SEPARATOR: '-',
  INITIAL_VOTE_COUNT: 0,
  DECIMAL_PLACES: 1,
} as const;

export const DEFAULT_SCORE_RANGE = {
  min: SCORE_RANGE_CONSTANTS.MIN_SCORE,
  max: SCORE_RANGE_CONSTANTS.MAX_SCORE,
  scores: [...SCORE_RANGE_CONSTANTS.DEFAULT_SCORES],
};

export const getDefaultScoreRange = () => ({
  min: SCORE_RANGE_CONSTANTS.MIN_SCORE,
  max: SCORE_RANGE_CONSTANTS.MAX_SCORE,
  scores: [...SCORE_RANGE_CONSTANTS.DEFAULT_SCORES],
});

export const isValidScore = (score: number): boolean => {
  return (
    typeof score === 'number' &&
    !isNaN(score) &&
    score >= SCORE_RANGE_CONSTANTS.MIN_SCORE &&
    score <= SCORE_RANGE_CONSTANTS.MAX_SCORE
  );
};

export const createCacheKey = (
  healthCheckId: string,
  questionId: string,
): string => {
  return `${healthCheckId}${DATA_TRANSFORM_CONSTANTS.CACHE_KEY_SEPARATOR}${questionId}`;
};

export const formatAverageScore = (score: number): string => {
  return score.toFixed(DATA_TRANSFORM_CONSTANTS.DECIMAL_PLACES);
};
