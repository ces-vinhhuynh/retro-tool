import supabaseClient from '@/lib/supabase/client';

import { CalendarEventParams, CalendarEvent } from '../types/calendar';

export const getGoogleToken = async (): Promise<string> => {
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error || !session?.provider_token) {
    throw new Error('Google access token not available');
  }

  return session.provider_token;
};

export const createCalendarEvent = ({
  title,
  description,
  emails,
  dueDate,
}: CalendarEventParams): CalendarEvent => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startTime = new Date();
  startTime.setHours(10, 30, 0, 0);

  const endTime = new Date();
  endTime.setHours(11, 0, 0, 0);

  const untilDate = new Date(dueDate);
  untilDate.setHours(23, 59, 59);

  const untilStr =
    untilDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return {
    summary: title,
    description,
    attendees: emails?.map((email) => ({ email })) ?? [],
    start: {
      dateTime: startTime.toISOString(),
      timeZone,
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone,
    },
    recurrence: [`RRULE:FREQ=DAILY;UNTIL=${untilStr}`],
  };
};
