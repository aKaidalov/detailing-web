import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type {
  TimeSlotTemplate,
  CreateTimeSlotTemplateRequest,
  UpdateTimeSlotTemplateRequest,
} from '../types';

export function useAdminTimeSlotTemplates() {
  return useQuery({
    queryKey: ['adminTimeSlotTemplates'],
    queryFn: () => api.get<TimeSlotTemplate[]>('/admin/time-slot-templates'),
  });
}

export function useCreateTimeSlotTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTimeSlotTemplateRequest) =>
      api.post<TimeSlotTemplate>('/admin/time-slot-templates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimeSlotTemplates'] });
    },
  });
}

export function useUpdateTimeSlotTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTimeSlotTemplateRequest }) =>
      api.put<TimeSlotTemplate>(`/admin/time-slot-templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimeSlotTemplates'] });
    },
  });
}

export function useDeleteTimeSlotTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/time-slot-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimeSlotTemplates'] });
    },
  });
}
