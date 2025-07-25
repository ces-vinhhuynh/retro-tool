'use client';

import _groupBy from 'lodash.groupby';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ChartDialog } from '@/features/health-check/components/chart-dialog';
import { ClosePhase } from '@/features/health-check/components/close-phase';
import { DiscussPhase } from '@/features/health-check/components/discuss-phase';
import { TeamMember } from '@/features/health-check/components/invite-table/columns';
import { OpenActionsPhase } from '@/features/health-check/components/open-actions-phase';
import { ReviewPhase } from '@/features/health-check/components/review-phase';
import { WelcomeModal } from '@/features/health-check/components/sessions/welcome-modal';
import { SurveyPhase } from '@/features/health-check/components/survey-phase';
import { useAgreementsQuery } from '@/features/health-check/hooks/agreements/use-agreements-query';
import { useAgreementsSubscription } from '@/features/health-check/hooks/agreements/use-agreements-subscription';
import { useIssuesQuery } from '@/features/health-check/hooks/issues/use-issues-query';
import { useIssuesSubscription } from '@/features/health-check/hooks/issues/use-issues-subscription';
import { useActionItemAssignSubscription } from '@/features/health-check/hooks/use-action-item-assign-subscription';
import { useActionItemsByTeamsSubscription } from '@/features/health-check/hooks/use-action-items-by-teams-subscriptions';
import { useCreateParticipant } from '@/features/health-check/hooks/use-create-participants';
import { useGetActionItemsByTeamId } from '@/features/health-check/hooks/use-get-action-items-by-team-id';
import { useGetHealthChecksByTeamsAndTemplate } from '@/features/health-check/hooks/use-get-health-checks-by-teams-and-template';
import { useGetParticipants } from '@/features/health-check/hooks/use-get-participants';
import {
  useHealthCheckMutations,
  useHealthCheckWithTemplate,
} from '@/features/health-check/hooks/use-health-check';
import { useHealthCheckSubscription } from '@/features/health-check/hooks/use-health-check-subscription';
import { useGetTemplateById } from '@/features/health-check/hooks/use-health-check-templates';
import { useHealthChecksSubscription } from '@/features/health-check/hooks/use-health-checks-subscription';
import { useInviteUserToHealthCheck } from '@/features/health-check/hooks/use-invite-user-to-health-check';
import { useParticipantsSubscription } from '@/features/health-check/hooks/use-participants-subscription';
import {
  useCreateResponse,
  useResponse,
  useResponses,
} from '@/features/health-check/hooks/use-response';
import { useResponsesSubscription } from '@/features/health-check/hooks/use-response-subcription';
import { useScrumHealthCheckSubscription } from '@/features/health-check/hooks/use-scrum-health-check-subscription';
import { useUpdateAverageScores } from '@/features/health-check/hooks/use-update-average-scores';
import {
  removeLatestHealthCheck,
  saveLatestHealthCheck,
} from '@/features/health-check/stores/latest-health-check-storage';
import { useWelcomeModalStore } from '@/features/health-check/stores/welcome-modal-store';
import {
  HealthCheckSettings,
  HealthCheckStatus,
  HealthCheckWithTemplate,
  Question,
  ResponseWithUser,
  Score,
  User,
  Section,
  HealthCheckWithTeam,
  ParticipantWithUser,
} from '@/features/health-check/types/health-check';
import { getCommentsByQuestionId } from '@/features/health-check/utils/comment';
import {
  FIRST_STEP,
  LAST_STEP,
  STEPS,
} from '@/features/health-check/utils/constants';
import { getRatings } from '@/features/health-check/utils/rating';
import {
  TEAM_ROLES,
  WORKSPACE_ROLES,
} from '@/features/workspace/constants/user';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamMembers } from '@/features/workspace/hooks/use-get-team-member';
import { useGetTeamUser } from '@/features/workspace/hooks/use-get-team-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';
import { cn } from '@/utils/cn';

export type GroupedQuestions = {
  [section: string]: Question[];
};

export default function HealthCheckPage() {
  const router = useRouter();
  const { id: healthCheckId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const questionId = searchParams.get('questionId');
  const [dialogOpen, setDialogOpen] = useState(false);
  const isManuallyClosingRef = useRef(false);

  const {
    isOpen: isWelcomeModalOpen,
    open: openWelcomeModal,
    close: closeWelcomeModal,
    hasSeenModal,
    markAsSeen,
  } = useWelcomeModalStore();

  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: healthCheck, isLoading: isLoadingHealthCheck } =
    useHealthCheckWithTemplate(healthCheckId);
  const { data: template, isLoading: isLoadingTemplate } = useGetTemplateById(
    healthCheck?.template_id || '',
  );
  const { data: response, isLoading: isLoadingResponse } = useResponse(
    healthCheck?.id || '',
    currentUser?.id || '',
  );
  const { data: responses, isLoading: isLoadingResponses } =
    useResponses(healthCheckId);

  const { data: actionItems, isLoading: isLoadingActionItems } =
    useGetActionItemsByTeamId(healthCheck?.team_id || '');

  const { data: participants, isLoading: isLoadingParticipants } =
    useGetParticipants(healthCheckId);

  const { data: agreements = [], isLoading: isLoadingAgreements } =
    useAgreementsQuery(healthCheck?.team_id || '');

  const { data: issues = [], isLoading: isLoadingIssues } = useIssuesQuery(
    healthCheck?.team_id || '',
  );

  const { mutate: createParticipant } = useCreateParticipant();

  const { data: scrumHealthChecks } = useGetHealthChecksByTeamsAndTemplate(
    healthCheck?.template_id ?? '',
    healthCheck?.team_id ?? '',
  );
  const { data: teamMembers = [] } = useGetTeamMembers(
    healthCheck?.team_id ?? '',
  );

  const { data: team } = useGetTeam(healthCheck?.team_id || '');

  const { data: teamUser } = useGetTeamUser(
    healthCheck?.team_id ?? '',
    currentUser?.id || '',
  );

  const { data: workspaceUser } = useGetWorkspaceUser(
    team?.workspace_id || '',
    currentUser?.id || '',
  );

  const isAdmin =
    teamUser?.role === TEAM_ROLES.admin ||
    workspaceUser?.role === WORKSPACE_ROLES.owner ||
    workspaceUser?.role === WORKSPACE_ROLES.admin;

  const { mutate: inviteUserToHealthCheck, isPending: isInviting } =
    useInviteUserToHealthCheck();

  useEffect(() => {
    if (!isLoadingParticipants && !isLoadingUser && currentUser) {
      const isUserParticipant = participants?.some(
        (participant) => participant.user_id === currentUser.id,
      );
      if (!isUserParticipant) {
        createParticipant({
          healthCheckId,
          userId: currentUser.id,
        });
      }
    }
  }, [
    isLoadingParticipants,
    isLoadingUser,
    participants,
    currentUser,
    createParticipant,
    healthCheckId,
  ]);

  // Subscribe to real-time updates for the health check and responses
  useHealthCheckSubscription(healthCheckId);
  useResponsesSubscription(healthCheckId);
  useParticipantsSubscription(healthCheckId);
  useAgreementsSubscription(healthCheck?.team_id || '');
  useIssuesSubscription(healthCheck?.team_id || '');
  useActionItemsByTeamsSubscription(healthCheck?.team_id || '');
  useActionItemAssignSubscription(healthCheck?.team_id || '');

  useScrumHealthCheckSubscription(
    healthCheck?.template_id || '',
    healthCheck?.team_id || '',
  );
  useHealthChecksSubscription();

  const { updateHealthCheck } = useHealthCheckMutations();
  const { mutate: createResponse, isPending } = useCreateResponse();
  const { mutate: updateAverageScores } = useUpdateAverageScores();
  const saveHealthCheckActivity = (
    healthCheckId: string,
    teamId: string,
    userId: string,
  ) => {
    if (healthCheckId && userId) {
      saveLatestHealthCheck(healthCheckId, teamId, userId);
    }
  };

  const questions: Question[] = (template?.questions as Question[]) || [];
  const grouped = _groupBy(questions, 'section');
  const sections = Object.keys(grouped);
  const isFacilitator =
    !!currentUser?.id && healthCheck?.facilitator_ids?.includes(currentUser.id);

  const isCompleted = healthCheck?.status === HealthCheckStatus.DONE;

  const [selectedIndex, setSelectedIndex] = useState(0);

  const visibleQuestions = questions.filter(
    (q) => q.section !== Section.AdditionalQuestions,
  );

  const chartData = visibleQuestions.map((question) => {
    const ratings = getRatings(responses || [], question.id);
    const comments = getCommentsByQuestionId(responses || [], question.id);
    const total = ratings.reduce((sum, r) => sum + r.count, 0);
    const avgScore = total
      ? ratings.reduce((sum, r) => sum + r.score * r.count, 0) / total
      : 0;

    return {
      id: question.id,
      subject: question.title,
      value: avgScore,
      fullTitle: question.title,
      description: question.description,
      comments: comments.map((c) => ({
        comment: c.comment,
        created_at: c.created_at || new Date().toISOString(),
      })),
    };
  });

  // Function to update URL param when question changes
  const updateQuestionUrl = (questionIndex: number) => {
    const question = visibleQuestions[questionIndex];
    if (question) {
      const url = new URL(window.location.href);
      url.searchParams.set('questionId', question.id);
      router.push(url.pathname + url.search, { scroll: false });
    }
  };

  const onCurrentIndexChange = (index: number) => {
    setSelectedIndex(index);
    updateQuestionUrl(index);
  };

  const handleQuestionClick = (index: number) => {
    setSelectedIndex(index);
    setDialogOpen(true);
    updateQuestionUrl(index);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    // Remove questionId from URL when closing dialog
    if (!open) {
      isManuallyClosingRef.current = true;
      const url = new URL(window.location.href);
      url.searchParams.delete('questionId');
      router.push(url.pathname + url.search, { scroll: false });
    }
  };

  // Handle questionId query parameter from URL
  useEffect(() => {
    if (
      questionId &&
      visibleQuestions.length > 0 &&
      !isManuallyClosingRef.current
    ) {
      const questionIndex = visibleQuestions.findIndex(
        (q) => q.id === questionId,
      );
      if (questionIndex !== -1) {
        setSelectedIndex(questionIndex);
        setDialogOpen(true);
      }
    }
    // Reset the flag after processing
    if (!questionId) {
      isManuallyClosingRef.current = false;
    }
  }, [questionId, visibleQuestions]);

  useEffect(() => {
    if (
      !isLoadingUser &&
      !isLoadingHealthCheck &&
      !isLoadingResponse &&
      currentUser &&
      healthCheck &&
      !response
    ) {
      createResponse({
        health_check_id: healthCheckId,
        user_id: currentUser.id,
        answers: {},
      });
    }
  }, [
    currentUser,
    healthCheck,
    response,
    isLoadingUser,
    isLoadingHealthCheck,
    isLoadingResponse,
    healthCheckId,
    createResponse,
  ]);

  useEffect(() => {
    if (
      !isLoadingUser &&
      !isLoadingHealthCheck &&
      currentUser &&
      healthCheck &&
      healthCheck.facilitator_ids?.includes(String(currentUser.id)) &&
      (healthCheck.current_step === 1 || healthCheck.current_step === null)
    ) {
      if (!hasSeenModal(healthCheckId)) {
        openWelcomeModal(healthCheckId);
        markAsSeen(healthCheckId);
      }
    }
  }, [
    currentUser,
    openWelcomeModal,
    hasSeenModal,
    markAsSeen,
    healthCheck,
    isLoadingUser,
    isLoadingHealthCheck,
    healthCheckId,
  ]);

  useEffect(() => {
    if (
      !isLoadingUser &&
      !isLoadingHealthCheck &&
      currentUser?.id &&
      healthCheckId &&
      healthCheck?.team_id &&
      healthCheck?.status === 'in progress' &&
      isFacilitator
    ) {
      saveHealthCheckActivity(
        healthCheckId,
        healthCheck.team_id,
        currentUser.id,
      );
    }
  }, [
    isLoadingUser,
    isLoadingHealthCheck,
    currentUser?.id,
    healthCheckId,
    isFacilitator,
    healthCheck,
  ]);

  const handleCompleteHealthCheck = () => {
    if (isFacilitator && !isCompleted) {
      updateHealthCheck({
        id: healthCheck?.id ?? '',
        healthCheck: {
          status: HealthCheckStatus.DONE,
          updated_at: new Date().toISOString(),
        },
      });
    }
  };

  const getNextPhaseButtonText = () => {
    if (healthCheck?.current_step === LAST_STEP.key) return;
    if (healthCheck?.current_step === STEPS['survey'].key)
      return STEPS['openActions'].value;
    if (healthCheck?.current_step === STEPS['openActions'].key)
      return STEPS['discuss'].value;
    if (healthCheck?.current_step === STEPS['discuss'].key)
      return STEPS['review'].value;
    if (healthCheck?.current_step === STEPS['review'].key)
      return STEPS['close'].value;
  };

  const handleChangePhase = () => {
    // Update last_active before changing phase (if isFacilitator)
    if (
      isFacilitator &&
      currentUser?.id &&
      healthCheckId &&
      healthCheck?.team_id &&
      healthCheck?.status === 'in progress'
    ) {
      saveHealthCheckActivity(
        healthCheckId,
        healthCheck.team_id,
        currentUser.id,
      );
    }

    if (healthCheck?.current_step === FIRST_STEP.key) {
      updateAverageScores({ healthCheckId: healthCheck.id });
      updateHealthCheck({
        id: healthCheck.id,
        healthCheck: {
          current_step: (healthCheck?.current_step || 1) + 1,
        },
      });
    }
    if (healthCheck?.current_step !== LAST_STEP.key) {
      return updateHealthCheck({
        id: healthCheck?.id ?? '',
        healthCheck: {
          current_step: (healthCheck?.current_step || 1) + 1,
        },
      });
    }
    removeLatestHealthCheck();
    handleCompleteHealthCheck();
    router.push(`/teams/${healthCheck.team_id}`);
  };

  const handleInviteUser = (userIds: string[]) => {
    inviteUserToHealthCheck({ userIds, healthCheckId });
  };

  const isLoading =
    isLoadingUser ||
    isLoadingHealthCheck ||
    isLoadingResponses ||
    isLoadingResponse ||
    isLoadingActionItems ||
    isLoadingAgreements ||
    isLoadingIssues ||
    isLoadingTemplate ||
    isPending;

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center gap-10 p-10">
        <Skeleton className="h-12 w-[40vw]" />
        <Skeleton className="h-[80vh] w-full" />
      </div>
    );
  }

  if (!healthCheck) {
    return <div>Health check not found</div>;
  }

  return (
    <div className="flex w-full justify-between px-3 lg:px-0">
      <div className="flex w-full flex-col">
        <div className="flex w-full">
          <div className="mx-auto w-full p-2 md:p-4 lg:p-8">
            {healthCheck.current_step === STEPS['survey'].key ? (
              <SurveyPhase
                healthCheck={healthCheck as HealthCheckWithTemplate}
                sections={sections}
                currentUser={currentUser as unknown as User}
                groupedQuestions={grouped}
                minScore={template?.min_value as Score}
                maxScore={template?.max_value as Score}
                response={response}
                settings={healthCheck.settings as HealthCheckSettings}
                questions={questions}
              />
            ) : (
              <Card className="mx-auto w-full flex-shrink-0 overflow-hidden px-2 sm:px-4 md:px-6">
                {healthCheck.current_step === STEPS['openActions'].key && (
                  <OpenActionsPhase
                    agreements={agreements || []}
                    issues={issues || []}
                    healthCheck={healthCheck as HealthCheckWithTemplate}
                    actionItems={actionItems || []}
                    teamId={healthCheck?.team_id || ''}
                    //TODO: remove cast type as unknown as User[] when we have exact the type for teamMembers
                    teamMembers={teamMembers as unknown as User[]}
                    isAdmin={isAdmin}
                  />
                )}
                {healthCheck.current_step === STEPS['discuss'].key && (
                  <DiscussPhase
                    healthCheck={healthCheck as HealthCheckWithTemplate}
                    questions={questions}
                    responses={responses ?? []}
                    actionItems={actionItems ?? []}
                    //TODO: remove cast type as unknown as User[] when we have exact the type for teamMembers
                    teamMembers={teamMembers as unknown as User[]}
                    handleQuestionClick={handleQuestionClick}
                    isAdmin={isAdmin}
                  />
                )}
                {healthCheck.current_step === STEPS['review'].key && (
                  <ReviewPhase
                    agreements={agreements || []}
                    issues={issues || []}
                    healthCheck={healthCheck as HealthCheckWithTemplate}
                    actionItems={actionItems || []}
                    teamId={healthCheck?.team_id || ''}
                    teamSize={participants?.length || 0}
                    //TODO: remove cast type as unknown as User[] when we have exact the type for teamMembers
                    teamMembers={teamMembers as unknown as User[]}
                    isFacilitator={isFacilitator || false}
                    isAdmin={isAdmin}
                  />
                )}
                {healthCheck.current_step === STEPS['close'].key && (
                  <ClosePhase
                    //TODO: remove cast type as unknown as User[] when we have exact the type for teamMembers
                    teamMembers={teamMembers as unknown as User[]}
                    healthCheck={healthCheck as HealthCheckWithTemplate}
                    questions={questions}
                    responses={responses as ResponseWithUser[]}
                    actionItems={actionItems || []}
                    scrumHealthChecks={
                      scrumHealthChecks as HealthCheckWithTemplate[]
                    }
                    teamSize={participants?.length || 0}
                    //TODO: remove cast type as unknown as User[] when we have exact the type for currentUser
                    currentUser={currentUser as unknown as User}
                    isAdmin={isAdmin}
                  />
                )}
              </Card>
            )}
          </div>
          {healthCheck && (
            <WelcomeModal
              isOpen={isWelcomeModalOpen}
              onClose={closeWelcomeModal}
              healthCheck={healthCheck as HealthCheckWithTeam}
              template={template}
              teamMembers={teamMembers as TeamMember[]}
              facilitatorIds={healthCheck?.facilitator_ids || []}
              participants={participants as ParticipantWithUser[]}
              handleInviteUser={handleInviteUser}
              isInviting={isInviting}
              healthCheckId={healthCheckId}
            />
          )}
        </div>
        {isFacilitator && (
          <div className="mx-auto flex py-5">
            <Button
              className={cn('ml-auto w-full text-white sm:w-auto', {
                'bg-rhino-500 hover:bg-rhino-600':
                  healthCheck?.current_step !== LAST_STEP.key,
              })}
              onClick={handleChangePhase}
            >
              {healthCheck?.current_step !== LAST_STEP.key
                ? getNextPhaseButtonText()
                : 'Exit Health Check'}
            </Button>
          </div>
        )}
        {dialogOpen && (
          <ChartDialog
            teamMembers={teamMembers.map((member) => ({
              id: member.id,
              full_name: member.full_name,
              email: member.email,
              avatar_url: member.avatar_url,
              created_at: null,
              updated_at: null,
            }))}
            open={dialogOpen}
            onOpenChange={handleDialogOpenChange}
            data={chartData}
            currentIndex={selectedIndex}
            onCurrentIndexChange={onCurrentIndexChange}
            healthCheck={healthCheck}
            actionItems={actionItems || []}
            isFacilitator={isFacilitator}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
}
