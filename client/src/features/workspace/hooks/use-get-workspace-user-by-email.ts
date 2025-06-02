import { useQuery } from '@tanstack/react-query';

import { workspaceUsersService } from '../api/workspace-users';

export function useGetWorkspaceUserByEmailAndWorkspaceId(
  email: string,
  workspaceId: string,
) {
  return useQuery({
    queryKey: ['workspace-user-by-email', email, workspaceId],
    queryFn: () =>
      workspaceUsersService.getWorkspaceUserByEmailAndWorkspaceId(
        email,
        workspaceId,
      ),
    enabled: !!email && !!workspaceId,
  });
}
