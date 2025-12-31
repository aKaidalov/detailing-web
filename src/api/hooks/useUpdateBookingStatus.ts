import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { AdminBookingDto, BookingStatusUpdateRequest } from '../types';

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: BookingStatusUpdateRequest['status'] }) =>
      api.put<AdminBookingDto>(`/admin/bookings/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.invalidateQueries({ queryKey: ['adminBooking'] });
    },
  });
}
