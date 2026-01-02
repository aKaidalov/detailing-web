import { useMutation } from '@tanstack/react-query';
import { api } from '../client';

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      return api.put('/admin/password', data);
    },
  });
}
