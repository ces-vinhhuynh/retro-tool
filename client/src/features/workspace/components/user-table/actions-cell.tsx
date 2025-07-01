import { Row } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { WORKSPACE_ROLES } from '../../constants/user';
import { useDeleteWorkspaceUser } from '../../hooks/use-delete-workspace-user';
import { WorkspaceUserTable } from '../../types/tables';

interface ActionsCellProps {
  row: Row<WorkspaceUserTable>;
}

export const ActionsCell = ({ row }: ActionsCellProps) => {
  const { id, role } = row.original;
  const { mutate: deleteWorkspaceUser } = useDeleteWorkspaceUser();

  const handleDeleteWorkspaceUser = (id: string) => {
    deleteWorkspaceUser(id);
  };

  return (
    <Button
      variant="ghost"
      onClick={() => handleDeleteWorkspaceUser(id)}
      disabled={role === WORKSPACE_ROLES.owner}
      className="hover:text-primary p-0 hover:bg-transparent"
    >
      <Trash2 />
    </Button>
  );
};
