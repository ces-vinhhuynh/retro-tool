'use client';

import { BadgeAlert, Handshake } from 'lucide-react';

import { useAgreementMutation } from '../hooks/agreements/use-agreements-mutation';
import { useIssuesMutation } from '../hooks/issues/use-issues-mutation';
import { Agreement } from '../types/agreements';
import {
  ActionItemWithAssignees,
  ActionStatus,
  HealthCheck,
  User,
} from '../types/health-check';
import { Issue } from '../types/issues';

import { ActionItemRow } from './action-item-row';
import EntryList from './entry-list';
import EntryWrapper from './entry-wrapper';

interface OpenActionsPhaseProps {
  agreements: Agreement[];
  issues: Issue[];
  actionItems: ActionItemWithAssignees[];
  healthCheck: HealthCheck;
  teamId: string;
  teamMembers: User[];
}

const OpenActionsPhase = ({
  agreements,
  issues,
  actionItems,
  healthCheck,
  teamId,
  teamMembers,
}: OpenActionsPhaseProps) => {
  const { previousActions, completedActions } = (actionItems ?? []).reduce(
    (acc, item) => {
      if (item.status === ActionStatus.DONE) {
        acc.completedActions.push(item);
      } else if (item.health_check_id !== healthCheck.id) {
        acc.previousActions.push(item);
      }
      return acc;
    },
    {
      previousActions: [] as ActionItemWithAssignees[],
      completedActions: [] as ActionItemWithAssignees[],
    },
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

  return (
    <div className="space-y-4 p-3 sm:space-y-6 sm:p-4 md:p-6">
      <h3 className="text-base font-medium sm:text-lg md:text-xl">
        Session Summary
      </h3>

      <EntryWrapper title="Actions from the previous Health check">
        {previousActions?.map((item) => (
          <ActionItemRow
            key={item.id}
            item={item}
            isEditable={false}
            teamMembers={teamMembers}
          />
        ))}
      </EntryWrapper>

      <EntryWrapper title="Completed Actions">
        {completedActions?.map((item) => (
          <ActionItemRow
            key={item.id}
            item={item}
            isEditable={false}
            teamMembers={teamMembers}
          />
        ))}
      </EntryWrapper>

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
  );
};

export default OpenActionsPhase;
