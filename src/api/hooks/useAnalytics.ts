import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { AnalyticsPeriod, BookingAnalytics, RevenueAnalytics } from '../types';

export function useBookingAnalytics(period: AnalyticsPeriod = 'DAY') {
  return useQuery({
    queryKey: ['bookingAnalytics', period],
    queryFn: () => api.get<BookingAnalytics>(`/admin/analytics/bookings?period=${period}`),
    refetchInterval: 30 * 1000, // Poll every 30 seconds for real-time updates
  });
}

export function useRevenueAnalytics(period: AnalyticsPeriod = 'DAY') {
  return useQuery({
    queryKey: ['revenueAnalytics', period],
    queryFn: () => api.get<RevenueAnalytics>(`/admin/analytics/revenue?period=${period}`),
    refetchInterval: 30 * 1000, // Poll every 30 seconds for real-time updates
  });
}
