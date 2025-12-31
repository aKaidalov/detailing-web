import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { AdminBookingDto } from '../types';

export function useAdminBooking(id: number | null) {
  return useQuery({
    queryKey: ['adminBooking', id],
    queryFn: () => api.get<AdminBookingDto>(`/admin/bookings/${id}`),
    enabled: id !== null,
  });
}
