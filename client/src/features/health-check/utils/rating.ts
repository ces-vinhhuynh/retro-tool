import { Answer, Response } from '../types/health-check';

export function getRatings(responses: Response[], questionId: string) {
  const ratingMap = new Map<number, number>();
  for (const response of responses) {
    const rating = (response.answers as Answer)?.[questionId]?.rating;
    if (typeof rating === 'number') {
      ratingMap.set(rating, (ratingMap.get(rating) || 0) + 1);
    }
  }
  return Array.from(ratingMap.entries())
    .map(([score, count]) => ({ score, count }))
    .sort((a, b) => b.score - a.score);
}
