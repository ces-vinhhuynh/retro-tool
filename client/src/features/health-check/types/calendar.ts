export type CalendarEventParams = {
  title?: string;
  description?: string;
  emails?: string[] | null;
  dueDate: string;
};

export type CalendarEvent = {
  summary?: string;
  description?: string;
  attendees: { email: string }[];
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurrence: string[];
}
