import { useQuery } from '@tanstack/react-query';

import { workspaceUsersService } from '../api/workspace-users';

export function useGetWorkspaceMembers(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['workspace-users', id],
    queryFn: () => workspaceUsersService.getWorkspaceUsersByWorkspaceId(id),
    placeholderData: [],
  });

  return { data, isLoading };
}
