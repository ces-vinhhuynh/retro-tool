import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authService } from '../api/auth';

export function useSignUp() {
  const router = useRouter();

  const { mutate: signUp, isPending: isSigningUp } = useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      full_name: string;
    }) => authService.signUp(data.email, data.password, data.full_name),
    onSuccess: () => {
      router.push('/auth/sign-up-success');
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { signUp, isSigningUp };
}
