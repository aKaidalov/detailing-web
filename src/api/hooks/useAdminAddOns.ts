import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { AddOn, CreateAddOnRequest, UpdateAddOnRequest } from '../types';

export function useAdminAddOns() {
  return useQuery({
    queryKey: ['adminAddOns'],
    queryFn: () => api.get<AddOn[]>('/admin/add-ons'),
  });
}

export function useCreateAddOn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAddOnRequest) =>
      api.post<AddOn>('/admin/add-ons', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAddOns'] });
      queryClient.invalidateQueries({ queryKey: ['addOns'] });
    },
  });
}

export function useUpdateAddOn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddOnRequest }) =>
      api.put<AddOn>(`/admin/add-ons/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAddOns'] });
      queryClient.invalidateQueries({ queryKey: ['addOns'] });
    },
  });
}

export function useDeleteAddOn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/add-ons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAddOns'] });
      queryClient.invalidateQueries({ queryKey: ['addOns'] });
    },
  });
}
