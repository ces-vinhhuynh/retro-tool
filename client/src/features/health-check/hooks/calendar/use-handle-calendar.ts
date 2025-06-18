import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { MESSAGE } from '@/utils/messages';

import { calendarService } from '../../api/calendar';
import { CalendarEventParams } from '../../types/calendar';
import { createCalendarEvent } from '../../utils/calendar';

type HandleCalendarParams = CalendarEventParams & {
  eventId?: string | null;
};

export const useHandleCalendar = () => {
  const handleCalendarEvent = async ({
    title,
    eventId,
    emails,
    description,
    dueDate,
  }: HandleCalendarParams) => {
    const event = createCalendarEvent({
      title,
      description,
      emails,
      dueDate,
    });

    const response = eventId
      ? await calendarService.updateEvent(event, eventId)
      : await calendarService.createEvent(event);

    const data = await response.json();
    return data.id;
  };

  return useMutation({
    mutationFn: handleCalendarEvent,
    onSuccess: (_, variables) => {
      toast.success(
        variables.eventId
          ? MESSAGE.CALENDAR_MESSAGES.UPDATE.SUCCESS
          : MESSAGE.CALENDAR_MESSAGES.CREATE.SUCCESS,
      );
    },
    onError: (error, variables) => {
      toast.error(
        variables.eventId
          ? MESSAGE.CALENDAR_MESSAGES.UPDATE.ERROR
          : MESSAGE.CALENDAR_MESSAGES.CREATE.ERROR,
        {
          description:
            error instanceof Error ? error.message : 'Unknown error occurred',
        },
      );
    },
  });
};
