import { useQuery } from '@tanstack/react-query';

import { teamUsersService } from '../api/team-users';

export function useGetTeamUserByToken(token: string) {
  return useQuery({
    queryKey: ['team-user-by-token', token],
    queryFn: () => teamUsersService.getTeamUserByToken(token),
    enabled: !!token,
  });
}
