import { SCORE_COLORS } from '@/utils/color';

export function getScoreColor({
  scoreSelected,
  score,
  maxScore,
}: {
  scoreSelected: number | undefined;
  score: number;
  maxScore: number;
}): string {
  const colorIndex = Math.round((score / maxScore) * 10);

  if (!scoreSelected) {
    // Scale the color based on the score's position in the range
    return SCORE_COLORS[colorIndex as keyof typeof SCORE_COLORS] || 'bg-muted';
  }

  return scoreSelected === score
    ? SCORE_COLORS[colorIndex as keyof typeof SCORE_COLORS]
    : 'bg-muted';
}
