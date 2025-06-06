import { BadgeAlert, Handshake } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';

import { useAgreementMutation } from '../hooks/agreements/use-agreements-mutation';
import { useIssuesMutation } from '../hooks/issues/use-issues-mutation';
import { Agreement } from '../types/agreements';
import {
  ActionItemWithAssignees,
  ActionStatus,
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
  <div className="space-y-1 rounded-lg bg-gray-50/50 p-2 sm:p-3">
    <div className="text-xs text-gray-500 sm:text-sm">{title}</div>
    <div className="text-sm font-medium sm:text-base">{content}</div>
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
    <CardContent className="space-y-6 p-3 sm:space-y-8 sm:p-4 md:p-6">
      <div className="space-y-3 sm:space-y-4">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 sm:text-base">
          {title}
        </h2>
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
    (item) =>
      item.health_check_id !== healthCheck.id &&
      item.status !== ActionStatus.DONE,
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
              healthCheck.status === ActionStatus.DONE
                ? 'bg-green-500'
                : 'bg-blue-500',
            )}
          />
          <div className="font-medium capitalize">{healthCheck.status}</div>
        </div>
      ),
    },
    { title: 'Participants', content: `${teamSize} team members` },
  ];

  return (
    <>
      <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-6 lg:p-8">
        <h3 className="text-base font-medium sm:text-lg md:text-xl">
          Session Summary
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {summaryItems.map((item, index) => (
            <SummaryItem
              key={index}
              title={item.title}
              content={item.content}
            />
          ))}
        </div>
      </CardContent>

      <div className="space-y-4 p-3 sm:space-y-6 sm:p-4 md:p-6">
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
                isEditable={true}
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
    </>
  );
};

export default ReviewPhase;
