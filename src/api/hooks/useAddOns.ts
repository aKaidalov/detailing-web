import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { AddOn } from '../types';

export function useAddOns(packageId: number | null) {
  return useQuery({
    queryKey: ['addOns', packageId],
    queryFn: () => api.get<AddOn[]>(`/packages/${packageId}/add-ons`),
    enabled: packageId !== null,
  });
}
