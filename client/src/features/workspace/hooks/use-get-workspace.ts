import { useQuery } from '@tanstack/react-query';

import { workspaceService } from '../api/workspace';

export function useGetWorkspace(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['workspace'],
    queryFn: () => workspaceService.getById(id),
  });

  return { data, isLoading };
}
