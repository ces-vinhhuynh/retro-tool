import { TRAILING_ZERO_REGEX } from '@/constants/regex';

export const roundAndRemoveTrailingZero = (num: number | string) =>
  Number(num).toFixed(1).replace(TRAILING_ZERO_REGEX, '');
