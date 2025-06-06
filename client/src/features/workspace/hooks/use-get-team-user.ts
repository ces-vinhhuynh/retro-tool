import { useQuery } from '@tanstack/react-query';

import { teamUsersService } from '../api/team-users';

export function useGetTeamUser(teamId: string, userId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['team-user', teamId, userId],
    queryFn: () => teamUsersService.getByTeamIdAndUserId(teamId, userId),
    enabled: !!teamId && !!userId,
  });

  return { data, isLoading };
}
