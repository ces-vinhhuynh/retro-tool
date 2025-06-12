export type Rating = {
  score: number;
  count: number;
};

export type ScoreDistribution = {
  [score: number]: number; // score -> count
};

export type QuestionChartData = {
  sprint: string;
  date: string | null;
  average: number;
  distribution: ScoreDistribution;
  totalVotes: number;
};

export type QuestionData = {
  id: string;
  title: string;
  description: string;
  chartData: QuestionChartData[];
};

export type ScoreRange = {
  min: number;
  max: number;
  scores: number[];
};

export type HealthCheckRatingFunction = (
  healthCheckId: string,
  questionId: string,
) => Rating[];
