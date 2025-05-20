import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamUsersService } from '../api/team-users';

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => teamUsersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team-members'],
      });
    },
  });

  return { mutate, isPending };
};
