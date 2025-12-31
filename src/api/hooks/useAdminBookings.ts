import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { AdminBookingDto } from '../types';

export function useAdminBookings() {
  return useQuery({
    queryKey: ['adminBookings'],
    queryFn: () => api.get<AdminBookingDto[]>('/admin/bookings'),
  });
}
