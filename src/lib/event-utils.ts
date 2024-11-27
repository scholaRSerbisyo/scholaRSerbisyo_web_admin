import { Event } from "@/components/types";

export function getEventStatus(event: Event): 'upcoming' | 'on-going' | 'previous' {
  const currentDate = new Date();
  const eventDateTime = new Date(event.date);
  
  // Set time to midnight for accurate date comparison
  currentDate.setHours(0, 0, 0, 0);
  eventDateTime.setHours(0, 0, 0, 0);

  if (eventDateTime > currentDate) {
    return 'upcoming';
  } else if (eventDateTime.getTime() === currentDate.getTime()) {
    return 'on-going';
  } else {
    return 'previous';
  }
}