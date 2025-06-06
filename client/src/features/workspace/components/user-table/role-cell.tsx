import { Row } from '@tanstack/react-table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils/cn';

import { WORKSPACE_ROLES, WorkspaceRole } from '../../constants/user';
import { useUpdateWorkspaceUser } from '../../hooks/use-update-workspace-user';
import { WorkspaceUserTable } from '../../types/tables';

interface RoleCellProps {
  row: Row<WorkspaceUserTable>;
  isOwnerOrAdmin: boolean;
}

export const RoleCell = ({ row, isOwnerOrAdmin }: RoleCellProps) => {
  const { id, role } = row.original;
  const { mutate: updateWorkspaceUser } = useUpdateWorkspaceUser();

  const handleUpdateWorkspaceUser = (newRole: WorkspaceRole) => {
    updateWorkspaceUser({ id, workspaceUser: { role: newRole } });
  };

  if (!isOwnerOrAdmin || role === WORKSPACE_ROLES.owner)
    return (
      <div
        className={cn(
          'w-fit rounded-4xl border border-gray-200 bg-gray-100 px-3 py-1.5 font-medium text-gray-900 capitalize focus:ring-0 focus:ring-offset-0',
          {
            'bg-ces-orange-500 text-white':
              role === WORKSPACE_ROLES.owner || role === WORKSPACE_ROLES.admin,
          },
        )}
      >
        {role}
      </div>
    );

  return (
    <Select value={role} onValueChange={handleUpdateWorkspaceUser}>
      <SelectTrigger
        className={cn(
          'w-fit cursor-pointer rounded-4xl border border-gray-200 bg-gray-100 px-3 py-1.5 font-medium text-gray-900 capitalize focus:ring-0 focus:ring-offset-0',
          {
            'bg-ces-orange-500 text-white': role === WORKSPACE_ROLES.admin,
          },
        )}
      >
        <SelectValue placeholder={WORKSPACE_ROLES[role]} />
      </SelectTrigger>
      <SelectContent>
        {Object.values([WORKSPACE_ROLES.admin, WORKSPACE_ROLES.member]).map(
          (role) => (
            <SelectItem
              key={role}
              value={role}
              className="text-gray-900 capitalize"
            >
              {role}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );
};
