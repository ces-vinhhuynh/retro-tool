import { SCORE_COLORS } from '@/utils/color';

type GetScoreColorParams = {
  scoreSelected?: number;
  score: number;
  maxScore: number;
};

export function getScoreColor({
  scoreSelected,
  score,
  maxScore,
}: GetScoreColorParams): string {
  const colorIndex = Math.round((score / maxScore) * 10);

  if (!scoreSelected) {
    return SCORE_COLORS[colorIndex as keyof typeof SCORE_COLORS] || 'bg-muted';
  }

  return scoreSelected === score
    ? SCORE_COLORS[colorIndex as keyof typeof SCORE_COLORS]
    : 'bg-muted';
}
