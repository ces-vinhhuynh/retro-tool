import { useQuery } from '@tanstack/react-query';

import { teamUsersService } from '../api/team-users';

export function useGetTeamMembers(id: string) {
  const getTeamMembers = async () => {
    const response = await teamUsersService.getTeamMember(id);

    return response;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['team-members', id],
    queryFn: getTeamMembers,
    placeholderData: [],
    enabled: !!id,
  });

  return { data, isLoading };
}
