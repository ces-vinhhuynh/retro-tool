import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authService } from '../api/auth';
import { LoginInputs } from '../schemas/auth.schema';

export function useSignIn() {
  const router = useRouter();

  const { mutate: signInWithEmail, isPending: isSigningInWithEmail } =
    useMutation({
      mutationFn: (data: LoginInputs) =>
        authService.signInWithEmail(data.email, data.password, data.rememberMe),
      onSuccess: () => {
        router.push('/');
      },
      onError: (error) => {
        toast.error('Error signing in', {
          description: error.message,
        });
      },
    });

  return { signInWithEmail, isSigningInWithEmail };
}
