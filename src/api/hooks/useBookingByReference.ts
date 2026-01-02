import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { AdminBookingDto } from '../types';

// Public endpoint - fetches booking by reference number
// Reuses AdminBookingDto since the backend returns the same BookingDto structure
export function useBookingByReference(reference: string | undefined) {
  return useQuery({
    queryKey: ['booking', reference],
    queryFn: () => api.get<AdminBookingDto>(`/bookings/${reference}`),
    enabled: !!reference,
  });
}
