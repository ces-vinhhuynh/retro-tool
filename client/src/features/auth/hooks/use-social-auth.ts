import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { authService } from '../api/auth';

export function useSocialAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';

  const { mutate: signInWithGoogle, isPending: isSigningInWithGoogle } =
    useMutation({
      mutationFn: () => authService.signInWithGoogle(next),
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
