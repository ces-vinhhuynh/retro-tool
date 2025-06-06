import { useQuery } from '@tanstack/react-query';

import { workspaceUsersService } from '../api/workspace-users';

export function useGetWorkspaceUser(workspaceId: string, userId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['workspace-user', workspaceId, userId],
    queryFn: () => workspaceUsersService.getByWorkspaceIdAndUserId(workspaceId, userId),
    enabled: !!workspaceId && !!userId,
  });

  return { data, isLoading };
}
