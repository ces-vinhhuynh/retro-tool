import { SCORE_COLORS, TAG_COLORS } from '@/utils/color';

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

export const scoreColorMap: Record<
  number | string,
  { bg: string; circle: string; text: string }
> = {
  0: { bg: 'bg-white', circle: 'bg-white', text: 'text-gray-800' },
  1: { bg: 'bg-[#f7d0c2]', circle: 'bg-[#e53e3e]', text: 'text-red-600' },
  2: { bg: 'bg-[#f9d8c1]', circle: 'bg-[#f56565]', text: 'text-red-500' },
  3: { bg: 'bg-[#f9dfc0]', circle: 'bg-[#ed8936]', text: 'text-orange-500' },
  4: { bg: 'bg-[#f9e5bf]', circle: 'bg-[#f6ad55]', text: 'text-orange-400' },
  5: { bg: 'bg-[#fae9bf]', circle: 'bg-[#f6e05e]', text: 'text-yellow-400' },
  6: { bg: 'bg-[#f4eabe]', circle: 'bg-[#ecc94b]', text: 'text-yellow-500' },
  7: { bg: 'bg-[#f4f2c6]', circle: 'bg-[#a3e635]', text: 'text-lime-400' },
  8: { bg: 'bg-[#eff4ca]', circle: 'bg-[#68d391]', text: 'text-green-400' },
  9: { bg: 'bg-[#e7f1cc]', circle: 'bg-[#48bb78]', text: 'text-green-500' },
  10: { bg: 'bg-[#dfedcf]', circle: 'bg-[#38a169]', text: 'text-green-600' },
};

export function getScoreColors(score: number) {
  const rounded = Math.max(0, Math.min(10, Math.round(score)));
  return scoreColorMap[rounded];
}

export function generateTagColors(max: number) {
  const tagColors: Record<string, { bg: string; text: string }> = {
    TBD: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
    },
  };

  Array.from({ length: max }, (_, i) => {
    const index = i + 1;
    const color = TAG_COLORS[i % TAG_COLORS.length];
    tagColors[String(index)] = color;
  });

  return tagColors;
}
