import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authService } from '../api/auth';

export const useUpdatePassword = () => {
  const router = useRouter();

  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: authService.updatePassword,
    onSuccess: () => {
      router.push('/');
    },
    onError: (error) => {
      toast.error('Error updating password', {
        description: error.message,
      });
    },
  });

  return { updatePassword, isPending };
};
