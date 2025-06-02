import { useQuery } from '@tanstack/react-query';

import { workspaceUsersService } from '../api/workspace-users';

export function useGetWorkspaceUserByToken(token: string) {
  return useQuery({
    queryKey: ['workspace-user-by-token', token],
    queryFn: () => workspaceUsersService.getWorkspaceUserByToken(token),
    enabled: !!token,
  });
}
