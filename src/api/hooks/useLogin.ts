import { useMutation } from '@tanstack/react-query';
import { api } from '../client';
import type { LoginRequest, LoginResponse } from '../types';

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      api.post<LoginResponse>('/admin/login', data),
  });
}
