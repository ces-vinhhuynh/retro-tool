import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authService } from '../api/auth';

export function useForgotPassword() {
  const {
    mutate: forgotPassword,
    isPending: isForgotPasswordPending,
    isSuccess,
  } = useMutation({
    mutationFn: authService.forgotPassword,
    onError: (error) => {
      toast.error('Error sending reset password email', {
        description: error.message,
      });
    },
  });

  return { forgotPassword, isForgotPasswordPending, isSuccess };
}
