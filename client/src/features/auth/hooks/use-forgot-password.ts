import { useMutation } from '@tanstack/react-query';

import { authService } from '../api/auth';

export function useForgotPassword() {
  const {
    mutate: forgotPassword,
    isPending: isForgotPasswordPending,
    isSuccess,
  } = useMutation({
    mutationFn: authService.forgotPassword,
    onError: (error) => {
      console.error(error);
    },
  });

  return { forgotPassword, isForgotPasswordPending, isSuccess };
}
