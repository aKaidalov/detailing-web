import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Backend logout endpoint can be added later
      // For now, just clear local state
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all cached queries on logout
      queryClient.clear();
    },
  });
}
