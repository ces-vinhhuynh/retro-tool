import { useState } from 'react';

import InviteModal from '@/components/modal/invite-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MESSAGE } from '@/utils/messages';

import { TeamRole, WorkspaceRole } from '../../constants/user';
import { useDeleteTeamMember } from '../../hooks/use-delete-team-member';
import { useGetTeam } from '../../hooks/use-get-team';
import { useGetTeamMembers } from '../../hooks/use-get-team-member';
import { useInviteUserToTeam } from '../../hooks/use-invite-user-to-team';
import { useUpdateTeamUser } from '../../hooks/use-update-team-user';
import { DataTable } from '../data-table';
import { useColumns } from '../team-members-table/columns';
import UserCard from '../user-card';

const MembersTab = ({
  teamId,
  isAdmin,
  currentUserRole,
}: {
  teamId: string;
  isAdmin: boolean;
  currentUserRole: WorkspaceRole;
}) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { data: team } = useGetTeam(teamId);
  const { data: teamMembers = [] } = useGetTeamMembers(teamId);

  const columns = useColumns(isAdmin, teamMembers.length);

  const { mutate: deleteTeamMember } = useDeleteTeamMember();
  const { mutate: updateTeamUser } = useUpdateTeamUser();

  const { mutate: inviteUserToTeam, isPending: isInvitingUserToTeam } =
    useInviteUserToTeam();

  const handleInvite = (email: string) => {
    inviteUserToTeam({
      email,
      teamId: team?.id ?? '',
      workspaceId: team?.workspace_id ?? '',
    });
  };

  return (
    <Card className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      {isAdmin && (
        <div className="flex flex-col justify-end-safe gap-4 md:flex-row md:items-center">
          <Button
            variant="default"
            className="w-full self-end md:w-auto"
            onClick={() => setShowInviteDialog(true)}
          >
            Invite member
          </Button>
          <InviteModal
            open={showInviteDialog}
            onClose={() => setShowInviteDialog(false)}
            onSubmit={handleInvite}
            isLoading={isInvitingUserToTeam}
            title={MESSAGE.INVITE_TO_TEAM_TITLE}
            description={MESSAGE.INVITE_TO_TEAM_DESCRIPTION}
          />
        </div>
      )}

      {/* Mobile/Tablet - Grid 2 columns (≤768px) */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {teamMembers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onDelete={(userId) => deleteTeamMember(userId)}
            onUpdateRole={(role) =>
              updateTeamUser({
                id: user.id,
                teamUser: {
                  role: role as TeamRole,
                },
              })
            }
            isWorkspaceUserCard={false}
            isOwnerOrAdmin={isAdmin}
            currentUserRole={currentUserRole}
            isCompact={true}
          />
        ))}
      </div>

      {/* Desktop (≥768px) */}
      <div className="hidden w-full overflow-x-auto md:block">
        <DataTable columns={columns} data={teamMembers} />
      </div>
    </Card>
  );
};

export default MembersTab;
