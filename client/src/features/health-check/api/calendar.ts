import { GOOGLE_CALENDAR_URL } from '@/utils/constant';

import { CalendarEvent } from '../types/calendar';
import { getGoogleToken } from '../utils/calendar';

class CalendarService {
  async createEvent(event: CalendarEvent) {
    const token = await getGoogleToken();

    const response = await fetch(`${GOOGLE_CALENDAR_URL}?sendUpdates=all`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    return response;
  }

  async updateEvent(event: CalendarEvent, eventId: string) {
    const token = await getGoogleToken();

    const response = await fetch(
      `${GOOGLE_CALENDAR_URL}/${eventId}?sendUpdates=all`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      },
    );

    return response;
  }
}

export const calendarService = new CalendarService();
