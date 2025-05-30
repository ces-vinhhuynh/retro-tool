import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { authService } from '../api/auth';
import { LoginInputs } from '../schemas/auth.schema';

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';

  const { mutate: signInWithEmail, isPending: isSigningInWithEmail } =
    useMutation({
      mutationFn: (data: LoginInputs) =>
        authService.signInWithEmail(data.email, data.password, data.rememberMe),
      onSuccess: () => {
        if (next.startsWith('/')) return router.push(next);
        return router.push('/');
      },
      onError: (error) => {
        toast.error('Error signing in', {
          description: error.message,
        });
      },
    });

  return { signInWithEmail, isSigningInWithEmail };
}
