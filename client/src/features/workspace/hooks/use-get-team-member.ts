import { useQuery } from '@tanstack/react-query';

import { useSubMenuStore } from '@/features/health-check/stores/sub-menu-store';
import { User } from '@/features/health-check/types/health-check';

import { teamUsersService } from '../api/team-users';

export function useGetTeamMembers(id: string) {
  const { setTeamMembers } = useSubMenuStore();
  const getTeamMembers = async () => {
    const response = await teamUsersService.getTeamMember(id);
    setTeamMembers(response as unknown as User[]);
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
