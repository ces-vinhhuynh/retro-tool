import { Row } from '@tanstack/react-table';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';

import { TEAM_ROLES } from '../../constants/user';
import { useDeleteTeam } from '../../hooks/use-delete-team';
import { useGetTeamUser } from '../../hooks/use-get-team-user';
import { TeamTable } from '../../types/tables';
import EditTeamDialog from '../edit-team-dialog';

interface RoleCellProps {
  row: Row<TeamTable>;
  isOwnerOrAdmin: boolean;
}

export const ActionsCell = ({ row, isOwnerOrAdmin }: RoleCellProps) => {
  const { id } = row.original;
  const { mutate: deleteTeam } = useDeleteTeam();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { data: teamUser } = useGetTeamUser(id, currentUser?.id || '');
  const isTeamAdmin = teamUser?.role === TEAM_ROLES.admin;

  const handleDeleteTeam = (id: string) => {
    deleteTeam(id);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            disabled={!isOwnerOrAdmin && !isTeamAdmin}
            className="h-8 w-8 p-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => setDialogOpen(true)}
            className="primary hover:text-ces-orange-500 flex w-full cursor-pointer justify-start gap-4 px-5"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleDeleteTeam(id)}
            className="primary focus:text-ces-orange-500 flex w-full cursor-pointer justify-start gap-4 px-5 text-red-600 focus:bg-transparent focus-visible:ring-0"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTeamDialog
        teamId={id}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
