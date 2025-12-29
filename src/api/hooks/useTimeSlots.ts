import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { TimeSlot } from '../types';

export function useTimeSlots(date: string | null) {
  return useQuery({
    queryKey: ['timeSlots', date],
    queryFn: () => api.get<TimeSlot[]>(`/time-slots?date=${date}`),
    enabled: date !== null,
  });
}
