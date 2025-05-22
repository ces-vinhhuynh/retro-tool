import { useQuery } from '@tanstack/react-query';

import { teamService } from '../api/team';

export const useGetTeam = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['teams', id],
    queryFn: () => teamService.getById(id),
    enabled: !!id,
  });

  return { data, isLoading, error };
};
