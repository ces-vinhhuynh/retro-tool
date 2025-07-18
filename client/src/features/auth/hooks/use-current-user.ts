import { useQuery } from '@tanstack/react-query';

import { User } from '@/features/health-check/types/health-check';
import useUserStore from '@/stores/user-store';

import { authService } from '../api/auth';

export function useCurrentUser() {
  const { setUser } = useUserStore();

  const getCurrentUser = async () => {
    const response = await authService.getCurrentUser();
    setUser(response as unknown as User);

    return response;
  };

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });
}
