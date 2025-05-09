import { format, parseISO, isValid } from 'date-fns';

export function formatCommentDate(dateString: string): string {
  if (!dateString) return '';

  const date = parseISO(dateString);
  if (!isValid(date)) return '';

  return format(date, 'dd-MMMM').toUpperCase();
}

export function formatDate(date: Date) {
  const day = format(date, 'EEE').toUpperCase();
  const dayNum = format(date, 'd');
  const month = format(date, 'MMMM').toUpperCase();
  return `${day} ${dayNum} ${month}`;
}

export function formatDateTime(date: Date) {
  return format(date, 'MM/dd/yyyy');
}
