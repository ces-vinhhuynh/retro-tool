import { useQuery } from '@tanstack/react-query';

import { useSubMenuStore } from '@/features/health-check/stores/sub-menu-store';
import { User } from '@/features/health-check/types/health-check';
import useUserStore from '@/stores/user-store';

import { authService } from '../api/auth';

export function useCurrentUser() {
  const { setUser } = useUserStore();
  const { healthCheck, setIsFacilitator } = useSubMenuStore();

  const getCurrentUser = async () => {
    const response = await authService.getCurrentUser();
    setUser(response as unknown as User);
    setIsFacilitator(healthCheck?.facilitator_id === response?.id);
    return response;
  };

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });
}
