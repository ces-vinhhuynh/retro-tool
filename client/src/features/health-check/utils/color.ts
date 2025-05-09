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

export const scoreColorMap: Record<number, { bg: string; circle: string }> = {
  0: { bg: 'bg-white', circle: 'bg-white' },
  1: { bg: 'bg-[#f7d0c2]', circle: 'bg-red-600' },
  2: { bg: 'bg-[#f9d8c1]', circle: 'bg-red-500' },
  3: { bg: 'bg-[#f9dfc0]', circle: 'bg-orange-500' },
  4: { bg: 'bg-[#f9e5bf]', circle: 'bg-orange-400' },
  5: { bg: 'bg-[#fae9bf]', circle: 'bg-yellow-400' },
  6: { bg: 'bg-[#f4eabe]', circle: 'bg-yellow-400' },
  7: { bg: 'bg-[#f4f2c6]', circle: 'bg-lime-400' },
  8: { bg: 'bg-[#eff4ca]', circle: 'bg-green-400' },
  9: { bg: 'bg-[#e7f1cc]', circle: 'bg-green-500' },
  10: { bg: 'bg-[#dfedcf]', circle: 'bg-green-600' },
};

export function getScoreColors(score: number) {
  const rounded = Math.max(1, Math.min(10, Math.round(score)));
  return scoreColorMap[rounded];
}
