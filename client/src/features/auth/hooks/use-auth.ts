'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authService } from '../api/auth';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: signInWithGoogle, isPending: isSigningIn } = useMutation({
    mutationFn: authService.signInWithGoogle,
    onSuccess: (data) => {
      if (data?.url) {
        router.push(data.url);
      }
    },
    onError: (error) => {
      // TODO: Handle show toast notification
      throw error;
    },
  });

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/auth/signin';
    },
    onError: (error) => {
      // TODO: Handle show toast notification
      throw error;
    },
  });

  return {
    signInWithGoogle,
    logout,
    isLoading: isSigningIn || isLoggingOut,
  };
}
