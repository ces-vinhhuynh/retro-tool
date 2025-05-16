import { useQuery } from '@tanstack/react-query';

import { usersService } from '../api/users';

export function useGetUsers() {
  return useQuery({
    queryKey: ['user-by-email'],
    queryFn: () => usersService.getUsers(),
  });
}
