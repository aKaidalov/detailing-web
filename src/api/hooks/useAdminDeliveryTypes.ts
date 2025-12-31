import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { DeliveryType, CreateDeliveryTypeRequest, UpdateDeliveryTypeRequest } from '../types';

export function useAdminDeliveryTypes() {
  return useQuery({
    queryKey: ['adminDeliveryTypes'],
    queryFn: () => api.get<DeliveryType[]>('/admin/delivery-types'),
  });
}

export function useCreateDeliveryType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDeliveryTypeRequest) =>
      api.post<DeliveryType>('/admin/delivery-types', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDeliveryTypes'] });
      queryClient.invalidateQueries({ queryKey: ['deliveryTypes'] });
    },
  });
}

export function useUpdateDeliveryType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeliveryTypeRequest }) =>
      api.put<DeliveryType>(`/admin/delivery-types/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDeliveryTypes'] });
      queryClient.invalidateQueries({ queryKey: ['deliveryTypes'] });
    },
  });
}

export function useDeleteDeliveryType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/delivery-types/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDeliveryTypes'] });
      queryClient.invalidateQueries({ queryKey: ['deliveryTypes'] });
    },
  });
}
