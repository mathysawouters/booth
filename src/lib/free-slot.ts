import { isRunningInExpoGo } from 'expo';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

const MINUTE = 60_000;
const MIN_SLOT = 15;
const MAX_SLOT = 30;

export type Slot = { start: Date; minutes: number; note: string | null };

function nowSlot(note: string): Slot {
  return { start: new Date(), minutes: MIN_SLOT, note };
}

export async function findFreeSlot(): Promise<Slot | null> {
  if (Platform.OS === 'web' || isRunningInExpoGo()) {
    return nowSlot('Reading your calendar needs a development build, so how about right now?');
  }
  const { granted } = await Calendar.requestCalendarPermissions();
  if (!granted) {
    return nowSlot('No calendar access, so how about right now?');
  }

  const now = new Date();
  const end = new Date(now);
  end.setHours(21, 0, 0, 0);
  if (end <= now) {
    end.setHours(23, 59, 0, 0);
  }

  const calendars = await Calendar.getCalendars(Calendar.EntityTypes.EVENT);
  const events = await Calendar.listEvents(calendars, now, end);
  const busy = events
    .filter((event) => !event.allDay && event.startDate && event.endDate)
    .map((event) => ({ start: +new Date(event.startDate!), end: +new Date(event.endDate!) }))
    .sort((a, b) => a.start - b.start);

  let cursor = Math.ceil(+now / (5 * MINUTE)) * 5 * MINUTE;
  for (const block of busy) {
    if (block.end <= cursor) continue;
    if (block.start - cursor >= MIN_SLOT * MINUTE) {
      return slotAt(cursor, block.start);
    }
    cursor = Math.max(cursor, block.end);
  }
  return +end - cursor >= MIN_SLOT * MINUTE ? slotAt(cursor, +end) : null;
}

function slotAt(start: number, end: number): Slot {
  return {
    start: new Date(start),
    minutes: Math.min(MAX_SLOT, Math.floor((end - start) / MINUTE)),
    note: null,
  };
}
