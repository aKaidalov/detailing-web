import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { Package } from '../types';

export function usePackages(vehicleTypeId: number | null) {
  return useQuery({
    queryKey: ['packages', vehicleTypeId],
    queryFn: () => api.get<Package[]>(`/vehicle-types/${vehicleTypeId}/packages`),
    enabled: vehicleTypeId !== null,
  });
}
