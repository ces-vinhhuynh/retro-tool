import { useQuery } from '@tanstack/react-query';

import { workspaceUsersService } from '../api/workspace-users';

export function useGetUserWorkspaces(userId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceUsersService.getWorkspaces(userId),
    enabled: !!userId,
  });

  return { data, isLoading };
}
