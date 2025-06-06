import { Row } from '@tanstack/react-table';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { cn } from '@/utils/cn';

import { TEAM_ROLES, TeamRole } from '../../constants/user';
import { TeamTable } from '../../types/tables';

interface RoleCellProps {
  row: Row<TeamTable>;
}

export const RoleCell = ({ row }: RoleCellProps) => {
  const { data: currentUser } = useCurrentUser();
  const { users } = row.original;
  const currentUserRole = users.find(({ id }) => currentUser?.id === id)?.role;
  return (
    currentUserRole && (
      <div
        className={cn(
          'w-fit rounded-4xl border border-gray-200 bg-gray-300/50 px-3 py-1.5 font-medium text-gray-900 capitalize focus:ring-0',
          {
            'bg-ces-orange-500 text-white':
              currentUserRole === TEAM_ROLES.admin,
          },
        )}
      >
        {TEAM_ROLES[currentUserRole as TeamRole]}
      </div>
    )
  );
};
