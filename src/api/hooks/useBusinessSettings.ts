import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { BusinessSettings } from '../types';

export function useBusinessSettings() {
  return useQuery({
    queryKey: ['businessSettings'],
    queryFn: () => api.get<BusinessSettings>('/admin/business-settings'),
  });
}

export function useUpdateBusinessSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: BusinessSettings) =>
      api.put<BusinessSettings>('/admin/business-settings', settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSettings'] });
    },
  });
}
