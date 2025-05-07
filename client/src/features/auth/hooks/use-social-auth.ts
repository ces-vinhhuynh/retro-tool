// src/features/auth/hooks/use-social-auth.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authService } from '../api/auth';

export function useSocialAuth() {
  const router = useRouter();

  const { mutate: signInWithGoogle, isPending: isSigningInWithGoogle } =
    useMutation({
      mutationFn: authService.signInWithGoogle,
      onSuccess: (data) => {
        if (data?.url) {
          router.push(data.url);
        }
      },
      onError: (error) => {
        console.error(error);
      },
    });

  return { signInWithGoogle, isSigningInWithGoogle };
}
