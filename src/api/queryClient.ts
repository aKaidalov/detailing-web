import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds - ensures fresh data on navigation
      retry: 1,
    },
    mutations: {
      onError: (error: Error) => {
        toast.error(error.message || 'An error occurred');
      },
    },
  },
});
