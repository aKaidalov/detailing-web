import { useMutation } from '@tanstack/react-query';
import { api } from '../client';
import type { CreateBookingRequest, BookingResponse } from '../types';

export function useCreateBooking() {
  return useMutation({
    mutationFn: (data: CreateBookingRequest) =>
      api.post<BookingResponse>('/bookings', data),
  });
}
