import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { AdminBookingDto } from '../types';

export function useAdminBookings() {
  return useQuery({
    queryKey: ['adminBookings'],
    queryFn: () => api.get<AdminBookingDto[]>('/admin/bookings'),
    refetchInterval: 30 * 1000, // Poll every 30 seconds for real-time updates
  });
}
