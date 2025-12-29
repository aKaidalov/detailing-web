import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { VehicleType } from '../types';

export function useVehicleTypes() {
  return useQuery({
    queryKey: ['vehicleTypes'],
    queryFn: () => api.get<VehicleType[]>('/vehicle-types'),
  });
}
