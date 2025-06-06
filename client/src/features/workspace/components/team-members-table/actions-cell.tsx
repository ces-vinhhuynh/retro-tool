import { Row } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useDeleteTeamMember } from '../../hooks/use-delete-team-member';
import { TeamMemberTable } from '../../types/tables';

interface ACtionsCellProps {
  row: Row<TeamMemberTable>;
}

export const ActionsCell = ({ row }: ACtionsCellProps) => {
  const { id } = row.original;
  const { mutate: deleteTeamMember } = useDeleteTeamMember();

  const handleDeleteTeamMember = (id: string) => {
    deleteTeamMember(id);
  };

  return (
    <div className="flex items-center">
      <Button variant="ghost" onClick={() => handleDeleteTeamMember(id)}>
        <Trash2 />
      </Button>
    </div>
  );
};
