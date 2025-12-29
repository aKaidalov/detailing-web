import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { DeliveryType } from '../types';

export function useDeliveryTypes() {
  return useQuery({
    queryKey: ['deliveryTypes'],
    queryFn: () => api.get<DeliveryType[]>('/delivery-types'),
  });
}
