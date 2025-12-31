import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/bookings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
    },
  });
}
