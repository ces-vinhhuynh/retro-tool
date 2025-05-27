import { BadgeAlert, Handshake } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';

import { useAgreementMutation } from '../hooks/agreements/use-agreements-mutation';
import { useAgreementsSubscription } from '../hooks/agreements/use-agreements-subscription';
import { useIssuesMutation } from '../hooks/issues/use-issues-mutation';
import { useIssuesSubscription } from '../hooks/issues/use-issues-subscription';
import { Agreement } from '../types/agreements';
import {
  ActionItemWithAssignees,
  HealthCheckWithTemplate,
  User,
} from '../types/health-check';
import { Issue } from '../types/issues';
import { formatDateTime } from '../utils/time-format';

import { ActionItemRow } from './action-item-row';
import ActionItems from './action-items';
import EntryList from './entry-list';

interface ReviewPhaseProps {
  agreements: Agreement[];
  issues: Issue[];
  healthCheck: HealthCheckWithTemplate;
  actionItems: ActionItemWithAssignees[];
  teamId: string;
  teamSize: number;
  teamMembers: User[];
}

interface SummaryItemProps {
  title: string;
  content: string | React.ReactNode;
}

const SummaryItem = ({ title, content }: SummaryItemProps) => (
  <div className="space-y-1">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="font-medium">{content}</div>
  </div>
);

const EntryWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
    <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
    <CardContent className="p-8">
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-medium">{title}</h2>
        {children}
      </div>
    </CardContent>
  </Card>
);

const ReviewPhase = ({
  agreements,
  issues,
  actionItems,
  healthCheck,
  teamSize = 0,
  teamId,
  teamMembers,
}: ReviewPhaseProps) => {
  const currentActionItems = actionItems?.filter(
    (item) => item.health_check_id === healthCheck.id,
  );

  const previousActionItems = actionItems?.filter(
    (item) => item.health_check_id !== healthCheck.id,
  );

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

  useAgreementsSubscription(teamId);
  useIssuesSubscription(teamId);

  const handleCreateAgreement = (title: string) => {
    createAgreements({
      title,
      team_id: teamId,
      health_check_id: healthCheck.id,
    });
  };

  const handleDeleteAgreement = (id: string) => {
    deleteAgreements(id);
  };

  const handleCreateIssue = (title: string) => {
    createIssue({
      title,
      team_id: teamId,
      health_check_id: healthCheck.id,
    });
  };

  const handleDeleteIssue = (id: string) => {
    deleteIssue(id);
  };

  const summaryItems = [
    { title: 'Session Name', content: healthCheck.title },
    {
      title: 'Date Created',
      content:
        healthCheck.created_at &&
        formatDateTime(new Date(healthCheck.created_at)),
    },
    {
      title: 'Status',
      content: (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'h-2 w-2 rounded-full',
              healthCheck.status === 'done' ? 'bg-green-500' : 'bg-blue-500',
            )}
          />
          <div className="font-medium capitalize">{healthCheck.status}</div>
        </div>
      ),
    },
    { title: 'Participants', content: `${teamSize} team members` },
  ];

  return (
    <Card className="mx-auto w-full max-w-7xl lg:w-4/6">
      <CardContent className="space-y-4 p-4 sm:p-8">
        <h3 className="text-lg font-medium">Session Summary</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {summaryItems.map((item, index) => (
            <SummaryItem
              key={index}
              title={item.title}
              content={item.content}
            />
          ))}
        </div>
      </CardContent>

      <div className="space-y-6 p-4 sm:p-6">
        <EntryWrapper title="Team actions">
          <ActionItems
            actionItems={currentActionItems}
            healthCheckId={healthCheck.id}
            teamId={teamId}
            teamMembers={teamMembers}
          />
        </EntryWrapper>

        {previousActionItems && (
          <EntryWrapper title="Actions from the previous Health check">
            {previousActionItems?.map((item) => (
              <ActionItemRow
                key={item.id}
                item={item}
                isEditable={false}
                teamMembers={teamMembers}
              />
            ))}
          </EntryWrapper>
        )}

        <EntryWrapper title="Team agreement">
          <EntryList
            items={agreements}
            emptyItemMessage="No agreements yet"
            Icon={Handshake}
            handleAddItem={handleCreateAgreement}
            handleDeleteItem={handleDeleteAgreement}
            isLoading={isLoadingAgreements}
          />
        </EntryWrapper>

        <EntryWrapper title="Long term issues">
          <EntryList
            items={issues}
            emptyItemMessage="No issues yet"
            Icon={BadgeAlert}
            handleAddItem={handleCreateIssue}
            handleDeleteItem={handleDeleteIssue}
            isLoading={isLoadingIssues}
          />
        </EntryWrapper>
      </div>
    </Card>
  );
};

export default ReviewPhase;
