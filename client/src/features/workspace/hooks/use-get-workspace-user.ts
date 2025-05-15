import { useQuery } from '@tanstack/react-query';

import { workspaceUsersService } from '../api/workspace-users';

export function useGetWorkspaceUser() {
  const { data, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceUsersService.getWorkspaces(),
  });

  return { data, isLoading };
}
