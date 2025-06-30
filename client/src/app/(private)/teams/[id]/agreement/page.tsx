'use client';

import { Handshake } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import EntryList from '@/features/health-check/components/entry-list';
import { useAgreementMutation } from '@/features/health-check/hooks/agreements/use-agreements-mutation';
import { useAgreementsQuery } from '@/features/health-check/hooks/agreements/use-agreements-query';
import { useAgreementsSubscription } from '@/features/health-check/hooks/agreements/use-agreements-subscription';
import { WORKSPACE_ROLES } from '@/features/workspace/constants/user';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamUser } from '@/features/workspace/hooks/use-get-team-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';

const TeamAgreementPage = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const router = useRouter();

  // Data fetching for team agreements
  const { data: agreements = [] } = useAgreementsQuery(teamId);

  const {
    createAgreements,
    deleteAgreements,
    isLoading: isLoadingAgreements,
  } = useAgreementMutation();

  // User and team data
  const { data: team } = useGetTeam(teamId);
  const { data: currentUser } = useCurrentUser();

  const { error } = useGetTeamUser(teamId, currentUser?.id || '');
  const { data: workspaceUser } = useGetWorkspaceUser(
    team?.workspace_id || '',
    currentUser?.id || '',
  );

  // Permission check
  useEffect(() => {
    if (
      error &&
      workspaceUser?.role !== WORKSPACE_ROLES.owner &&
      workspaceUser?.role !== WORKSPACE_ROLES.admin
    ) {
      router.push(`/workspaces/${workspaceUser?.workspace_id}`);
    }
  }, [error, workspaceUser, router]);

  const handleCreateAgreement = (title: string) => {
    createAgreements({
      title,
      team_id: teamId,
    });
  };

  const handleDeleteAgreement = (id: string) => {
    deleteAgreements(id);
  };

  useAgreementsSubscription(teamId);

  return (
    <div className="w-full p-4 md:p-6 lg:p-8">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
        <CardHeader>
          <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
            Team Agreements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <EntryList
            items={agreements}
            emptyItemMessage="No agreements yet"
            Icon={Handshake}
            handleAddItem={handleCreateAgreement}
            handleDeleteItem={handleDeleteAgreement}
            isLoading={isLoadingAgreements}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAgreementPage;
