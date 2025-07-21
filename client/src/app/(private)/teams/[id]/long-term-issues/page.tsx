'use client';

import { BadgeAlert } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { EntryList } from '@/features/health-check/components/entry-list';
import { useIssuesMutation } from '@/features/health-check/hooks/issues/use-issues-mutation';
import { useIssuesQuery } from '@/features/health-check/hooks/issues/use-issues-query';
import { useIssuesSubscription } from '@/features/health-check/hooks/issues/use-issues-subscription';
import { WORKSPACE_ROLES } from '@/features/workspace/constants/user';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamUser } from '@/features/workspace/hooks/use-get-team-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';

const LongTermIssuesPage = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: issues = [] } = useIssuesQuery(teamId);
  const [showAll, setShowAll] = useState(false);

  const {
    createIssue,
    deleteIssue,
    isLoading: isLoadingIssues,
  } = useIssuesMutation();

  const { data: team } = useGetTeam(teamId);
  const { data: currentUser } = useCurrentUser();

  const { error } = useGetTeamUser(teamId, currentUser?.id || '');
  const { data: workspaceUser } = useGetWorkspaceUser(
    team?.workspace_id || '',
    currentUser?.id || '',
  );

  useEffect(() => {
    if (
      error &&
      workspaceUser?.role !== WORKSPACE_ROLES.owner &&
      workspaceUser?.role !== WORKSPACE_ROLES.admin
    ) {
      router.push(`/workspaces/${workspaceUser?.workspace_id}`);
    }
  }, [error, workspaceUser, router]);

  const handleCreateIssue = (title: string) => {
    createIssue({ title, team_id: teamId });
  };

  const handleDeleteIssue = (id: string) => {
    deleteIssue(id);
  };

  useIssuesSubscription(teamId);

  const visibleIssues = showAll ? issues : issues.slice(0, 5);

  return (
    <div className="w-full p-4 md:p-6 lg:p-8">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
        <CardHeader>
          <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
            Long Term Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <EntryList
            items={visibleIssues}
            emptyItemMessage="No issues yet"
            Icon={BadgeAlert}
            handleAddItem={handleCreateIssue}
            handleDeleteItem={handleDeleteIssue}
            isLoading={isLoadingIssues}
          />

          {issues.length > 5 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll ? 'Show less' : 'Show all'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LongTermIssuesPage;
