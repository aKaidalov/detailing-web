import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { Package, CreatePackageRequest, UpdatePackageRequest } from '../types';

export function useAdminPackages() {
  return useQuery({
    queryKey: ['adminPackages'],
    queryFn: () => api.get<Package[]>('/admin/packages'),
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePackageRequest) =>
      api.post<Package>('/admin/packages', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePackageRequest }) =>
      api.put<Package>(`/admin/packages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/packages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}
