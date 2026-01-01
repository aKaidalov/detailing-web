import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { NotificationDto, NotificationType, NotificationUpdateRequest } from '../types';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get<NotificationDto[]>('/admin/notifications'),
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, request }: { type: NotificationType; request: NotificationUpdateRequest }) =>
      api.put<NotificationDto>(`/admin/notifications/${type}`, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
