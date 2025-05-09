import { format, parseISO, isValid } from 'date-fns';

export function formatCommentDate(dateString: string): string {
  if (!dateString) return '';

  const date = parseISO(dateString);
  if (!isValid(date)) return '';

  return format(date, 'dd-MMMM').toUpperCase();
}
