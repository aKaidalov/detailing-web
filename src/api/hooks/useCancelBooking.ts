import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';

// Public endpoint - cancels booking by reference number
// Sets booking status to CANCELLED_BY_CUSTOMER
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => api.delete<void>(`/bookings/${reference}`),
    onSuccess: (_data, reference) => {
      queryClient.invalidateQueries({ queryKey: ['booking', reference] });
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookingAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['revenueAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
    },
  });
}
