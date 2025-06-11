import { BadgeAlert } from 'lucide-react';

import { Issue } from '../types/issues';

import EntryList from './entry-list';
import SubMenuWrapper from './sub-menu-wrapper';

interface TeamIssuesProps {
  className?: string;
  issues: Issue[];
  handleCreateIssue: (title: string) => void;
  handleDeleteIssue: (id: string) => void;
  isLoadingIssues: boolean;
}

const TeamIssues = ({
  className,
  issues,
  handleCreateIssue,
  handleDeleteIssue,
  isLoadingIssues,
}: TeamIssuesProps) => {
  return (
    <SubMenuWrapper
      Icon={BadgeAlert}
      title="Long Term Issues"
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
