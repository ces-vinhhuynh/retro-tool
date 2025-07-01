import { Row } from '@tanstack/react-table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils/cn';

import { TEAM_ROLES, TeamRole } from '../../constants/user';
import { useUpdateTeamUser } from '../../hooks/use-update-team-user';
import { TeamMemberTable } from '../../types/tables';

interface RoleCellProps {
  row: Row<TeamMemberTable>;
  isAdmin: boolean;
}

export const RoleCell = ({ row, isAdmin }: RoleCellProps) => {
  const { id, role } = row.original;
  const { mutate: updateTeamUser } = useUpdateTeamUser();

  const handleUpdateTeamUser = (newRole: TeamRole) => {
    updateTeamUser({ id, teamUser: { role: newRole } });
  };

  if (!isAdmin)
    return (
      <div className="w-fit cursor-pointer rounded-4xl border border-gray-200 bg-gray-100 px-3 py-1.5 font-medium text-gray-900 capitalize focus:ring-0 focus:ring-offset-0">
        {role}
      </div>
    );

  return (
    <Select value={role} onValueChange={handleUpdateTeamUser}>
      <SelectTrigger
        className={cn(
          'w-fit cursor-pointer rounded-4xl border border-gray-200 bg-gray-100 px-3 py-1.5 font-medium text-gray-900 capitalize focus:ring-0 focus:ring-offset-0',
          {
            'bg-primary text-white': role === TEAM_ROLES.admin,
          },
        )}
      >
        <SelectValue placeholder={TEAM_ROLES[role]} />
      </SelectTrigger>
      <SelectContent>
        {Object.values(TEAM_ROLES).map((role) => (
          <SelectItem
            key={role}
            value={role}
            className="text-gray-900 capitalize"
          >
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
