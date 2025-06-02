import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authService } from '../api/auth';

export function useSocialAuth() {
  const router = useRouter();

  const { mutate: signInWithGoogle, isPending: isSigningInWithGoogle } =
    useMutation({
      mutationFn: (next: string) => authService.signInWithGoogle(next),
      onSuccess: (data) => {
        if (data?.url) {
          router.push(data.url);
        }
      },
      onError: (error) => {
        toast.error('Error signing in with Google', {
          description: error.message,
        });
      },
    });

  return { signInWithGoogle, isSigningInWithGoogle };
}
