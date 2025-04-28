import { useQuery } from '@tanstack/react-query';

import { authService } from '../api/auth';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
  });
}
