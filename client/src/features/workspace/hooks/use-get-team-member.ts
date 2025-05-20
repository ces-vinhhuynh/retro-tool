import { useQuery } from '@tanstack/react-query';

import { teamUsersService } from '../api/team-users';

export function useGetTeamMembers(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['team-members', id],
    queryFn: () => teamUsersService.getTeamMember(id),
    placeholderData: [],
    enabled: !!id,
  });

  return { data, isLoading };
}
