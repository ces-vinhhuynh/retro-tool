import { format, parseISO, isValid } from 'date-fns';

import { TIMER_CONFIG } from './constants';

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

export const getEndTime = (endTime: string) => {
  if (!endTime) {
    return TIMER_CONFIG.DEFAULT_TIME;
  }

  const endDate = new Date(endTime);
  const now = new Date();
  const diffInSeconds = Math.max(
    TIMER_CONFIG.MIN_TIME,
    Math.floor((endDate.getTime() - now.getTime()) / 1000),
  );
  return diffInSeconds;
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
