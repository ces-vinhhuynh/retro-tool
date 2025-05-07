// src/features/auth/hooks/use-sign-out.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authService } from '../api/auth';

export function useSignOut() {
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/auth/signin';
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { logout, isLoggingOut };
}
