import { useQuery } from '@tanstack/react-query';

import { workspaceUsersService } from '../api/workspace-users';

export function useGetWorkspaceUser(workspaceId: string, userId: string) {
  console.log(workspaceId, userId);
  const { data, isLoading } = useQuery({
    queryKey: ['workspace-user', workspaceId, userId],
    queryFn: () =>
      workspaceUsersService.getByWorkspaceIdAndUserId(workspaceId, userId),
    enabled: !!workspaceId && !!userId,
  });

  return { data, isLoading };
}
