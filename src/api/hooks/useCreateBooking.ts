import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { CreateBookingRequest, BookingResponse } from '../types';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) =>
      api.post<BookingResponse>('/bookings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookingAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['revenueAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
    },
  });
}
