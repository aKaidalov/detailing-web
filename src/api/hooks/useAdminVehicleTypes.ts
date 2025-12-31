import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { VehicleType, CreateVehicleTypeRequest, UpdateVehicleTypeRequest } from '../types';

export function useAdminVehicleTypes() {
  return useQuery({
    queryKey: ['adminVehicleTypes'],
    queryFn: () => api.get<VehicleType[]>('/admin/vehicle-types'),
  });
}

export function useCreateVehicleType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVehicleTypeRequest) =>
      api.post<VehicleType>('/admin/vehicle-types', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVehicleTypes'] });
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });
    },
  });
}

export function useUpdateVehicleType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVehicleTypeRequest }) =>
      api.put<VehicleType>(`/admin/vehicle-types/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVehicleTypes'] });
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });
    },
  });
}

export function useDeleteVehicleType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/vehicle-types/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVehicleTypes'] });
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });
    },
  });
}
