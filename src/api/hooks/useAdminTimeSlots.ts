import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type {
  TimeSlot,
  CreateTimeSlotRequest,
  UpdateTimeSlotRequest,
} from '../types';

export function useAdminTimeSlots(from: string, to: string) {
  return useQuery({
    queryKey: ['adminTimeSlots', from, to],
    queryFn: () => api.get<TimeSlot[]>(`/admin/time-slots?from=${from}&to=${to}`),
    enabled: !!from && !!to,
  });
}

export function useCreateTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTimeSlotRequest) =>
      api.post<TimeSlot>('/admin/time-slots', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimeSlots'] });
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
    },
  });
}

export function useUpdateTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTimeSlotRequest }) =>
      api.put<TimeSlot>(`/admin/time-slots/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimeSlots'] });
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
    },
  });
}

export function useDeleteTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/time-slots/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimeSlots'] });
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
    },
  });
}
