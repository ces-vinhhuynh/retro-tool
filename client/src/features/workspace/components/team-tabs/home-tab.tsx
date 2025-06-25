import { BadgeAlert, Handshake } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ActionItems from '@/features/health-check/components/action-items';
import EntryList from '@/features/health-check/components/entry-list';
import { useAgreementMutation } from '@/features/health-check/hooks/agreements/use-agreements-mutation';
import { useAgreementsSubscription } from '@/features/health-check/hooks/agreements/use-agreements-subscription';
import { useIssuesMutation } from '@/features/health-check/hooks/issues/use-issues-mutation';
import { useIssuesSubscription } from '@/features/health-check/hooks/issues/use-issues-subscription';
import { useActionItemAssignSubscription } from '@/features/health-check/hooks/use-action-item-assign-subscription';
import { useActionItemsByTeamsSubscription } from '@/features/health-check/hooks/use-action-items-by-teams-subscriptions';
import { Agreement } from '@/features/health-check/types/agreements';
import {
  ActionItemWithAssignees,
  User,
} from '@/features/health-check/types/health-check';
import { Issue } from '@/features/health-check/types/issues';


import { useGetTeamMembers } from '../../hooks/use-get-team-member';

interface HomeTabProps {
  teamId: string;
  actionItems: ActionItemWithAssignees[];
  agreements: Agreement[];
  issues: Issue[];
}

const HomeTab = ({ teamId, actionItems, agreements, issues }: HomeTabProps) => {

  const { data: teamMembers = [] } = useGetTeamMembers(teamId);

  const {
    createAgreements,
    deleteAgreements,
    isLoading: isLoadingAgreements,
  } = useAgreementMutation();

  const {
    createIssue,
    deleteIssue,
    isLoading: isLoadingIssues,
  } = useIssuesMutation();

  const handleCreateAgreement = (title: string) => {
    createAgreements({
      title,
      team_id: teamId,
    });
  };

  const handleDeleteAgreement = (id: string) => {
    deleteAgreements(id);
  };

  const handleCreateIssue = (title: string) => {
    createIssue({
      title,
      team_id: teamId,
    });
  };

  const handleDeleteIssue = (id: string) => {
    deleteIssue(id);
  };

  useAgreementsSubscription(teamId);
  useIssuesSubscription(teamId);
  useActionItemsByTeamsSubscription(String(teamId));
  useActionItemAssignSubscription(String(teamId));
  
  return (
    <Card className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
        <CardHeader>
          <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
            Team actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <ActionItems
            actionItems={actionItems}
            teamId={teamId}
            teamMembers={teamMembers as unknown as User[]}
            isHandlingOpenLink
          />
        </CardContent>
      </Card>
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
        <CardHeader>
          <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
            Team agreements
          </CardTitle>
        </CardHeader>
        <CardContent>
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

      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
        <CardHeader>
          <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
            Long term issues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <EntryList
            items={issues}
            emptyItemMessage="No issues yet"
            Icon={BadgeAlert}
            handleAddItem={handleCreateIssue}
            handleDeleteItem={handleDeleteIssue}
            isLoading={isLoadingIssues}
          />
        </CardContent>
      </Card>
    </Card>
  );
};

export default HomeTab;
