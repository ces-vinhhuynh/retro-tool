import { BadgeAlert } from 'lucide-react';

import { Issue } from '../types/issues';

import EntryList from './entry-list';
import SubMenuWrapper from './sub-menu-wrapper';

interface TeamIssuesProps {
  isOpen: boolean;
  className?: string;
  issues: Issue[];
  handleCreateIssue: (title: string) => void;
  handleDeleteIssue: (id: string) => void;
  isLoadingIssues: boolean;
}

const TeamIssues = ({
  isOpen,
  className,
  issues,
  handleCreateIssue,
  handleDeleteIssue,
  isLoadingIssues,
}: TeamIssuesProps) => {
  return (
    <SubMenuWrapper
      Icon={BadgeAlert}
      title="Team Issues"
      isOpen={isOpen}
      className={className}
    >
      <EntryList
        items={issues}
        emptyItemMessage="No issues yet"
        Icon={BadgeAlert}
        handleAddItem={handleCreateIssue}
        handleDeleteItem={handleDeleteIssue}
        isLoading={isLoadingIssues}
      />
    </SubMenuWrapper>
  );
};

export default TeamIssues;
