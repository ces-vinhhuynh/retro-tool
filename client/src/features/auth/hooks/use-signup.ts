import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authService } from '../api/auth';

export function useSignUp() {
  const router = useRouter();

  const { mutate: signUp, isPending: isSigningUp } = useMutation({
    mutationFn: (data: { email: string; password: string; fullName: string }) =>
      authService.signUp(data.email, data.password, data.fullName),
    onSuccess: () => {
      router.push('/auth/sign-up-success');
    },
    onError: (error) => {
      toast.error('Error signing up', {
        description: error.message,
      });
    },
  });

  return { signUp, isSigningUp };
}
