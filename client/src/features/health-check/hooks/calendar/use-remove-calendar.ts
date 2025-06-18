import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { GOOGLE_CALENDAR_URL } from '@/utils/constant';
import { MESSAGE } from '@/utils/messages';

import { getGoogleToken } from '../../utils/calendar';

export const useRemoveCalendar = () => {
  const removeCalendarEvent = async (eventId: string) => {
    const token = await getGoogleToken();
    const url = `${GOOGLE_CALENDAR_URL}/${eventId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(MESSAGE.CALENDAR_MESSAGES.REMOVE.ERROR);
    }
  };

  return useMutation({
    mutationFn: removeCalendarEvent,
    onSuccess: () => {
      toast.success(MESSAGE.CALENDAR_MESSAGES.REMOVE.SUCCESS);
    },
    onError: (error) => {
      toast.error(MESSAGE.CALENDAR_MESSAGES.REMOVE.ERROR, {
        description:
          error instanceof Error
            ? error.message
            : MESSAGE.CALENDAR_MESSAGES.REMOVE.ERROR_DESCRIPTION,
      });
    },
  });
};
