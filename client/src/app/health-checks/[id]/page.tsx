'use client';

import _groupBy from 'lodash.groupby';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import ClosePhase from '@/features/health-check/components/close-phase';
import DiscussPhase from '@/features/health-check/components/discuss-phase';
import HealthCheckSteps from '@/features/health-check/components/health-check-steps';
import ReviewPhase from '@/features/health-check/components/review-phase';
import WelcomeModal from '@/features/health-check/components/sessions/welcome-modal';
import SurveyTab from '@/features/health-check/components/survey-phase';
import Timer from '@/features/health-check/components/timer';
import {
  FIRST_STEP,
  LAST_STEP,
  STEPS,
} from '@/features/health-check/constants/health-check';
import { useAgreementsQuery } from '@/features/health-check/hooks/agreements/use-agreements-query';
import { useAgreementsSubscription } from '@/features/health-check/hooks/agreements/use-agreements-subscription';
import { useIssuesQuery } from '@/features/health-check/hooks/issues/use-issues-query';
import { useIssuesSubscription } from '@/features/health-check/hooks/issues/use-issues-subscription';
import { useCreateParticipant } from '@/features/health-check/hooks/use-create-participants';
import { useGetActionItemsByTeamId } from '@/features/health-check/hooks/use-get-action-items-by-team-id';
import { useGetHealthChecksByTeamsAndTemplate } from '@/features/health-check/hooks/use-get-health-checks-by-teams-and-template';
import { useGetParticipants } from '@/features/health-check/hooks/use-get-participants';
import {
  useHealthCheckMutations,
  useHealthCheckWithTemplate,
} from '@/features/health-check/hooks/use-health-check';
import { useHealthCheckSubscription } from '@/features/health-check/hooks/use-health-check-subscription';
import { useTemplateById } from '@/features/health-check/hooks/use-health-check-templates';
import { useHealthChecksSubscription } from '@/features/health-check/hooks/use-health-checks-subscription';
import { useParticipantsSubscription } from '@/features/health-check/hooks/use-participants-subscription';
import {
  useCreateResponse,
  useResponse,
  useResponses,
} from '@/features/health-check/hooks/use-response';
import { useResponsesSubscription } from '@/features/health-check/hooks/use-response-subcription';
import { useScrumHealthCheckSubscription } from '@/features/health-check/hooks/use-scrum-health-check-subscription';
import { useWelcomeModalStore } from '@/features/health-check/stores/welcome-modal-store';
import {
  HealthCheckSettings,
  HealthCheckStatus,
  HealthCheckWithTemplate,
  Question,
  ResponseWithUser,
  User,
} from '@/features/health-check/types/health-check';
import { useGetTeamMembers } from '@/features/workspace/hooks/use-get-team-member';

export type GroupedQuestions = {
  [section: string]: Question[];
};

export default function HealthCheckPage() {
  const router = useRouter();
  const { id: healthCheckId } = useParams<{ id: string }>();

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
  const { data: template } = useTemplateById(healthCheck?.template_id || '');
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

  
  useScrumHealthCheckSubscription(
    healthCheck?.template_id || '',
    healthCheck?.team_id || '',
  );
  useHealthChecksSubscription();

  const { updateHealthCheck } = useHealthCheckMutations();
  const { mutate: createResponse } = useCreateResponse();

  const questions: Question[] = template?.questions || [];
  const grouped = _groupBy(questions, 'section');
  const sections = Object.keys(grouped);
  const isFacilitator = currentUser?.id === healthCheck?.facilitator_id;
  const isCompleted = healthCheck?.status === HealthCheckStatus.DONE;

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
      currentUser.id === healthCheck.facilitator_id &&
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

  const handleChangeStep = (newStep: keyof typeof STEPS) => {
    if (!isFacilitator) return;

    if (STEPS[newStep].key === healthCheck?.current_step) return;

    if (healthCheck?.current_step !== 1) {
      updateHealthCheck({
        id: healthCheckId,
        healthCheck: { current_step: STEPS[newStep].key },
      });
      return;
    }

    const averageScores = calculateAverageScores();
    if (averageScores && Object.keys(averageScores).length > 0) {
      updateHealthCheck({
        id: healthCheck.id,
        healthCheck: {
          current_step: STEPS[newStep].key,
          average_score: averageScores,
        },
      });
    } else {
      updateHealthCheck({
        id: healthCheck.id,
        healthCheck: {
          current_step: STEPS[newStep].key,
        },
      });
    }
  };

  const calculateAverageScores = () => {
    if (!responses || responses?.length === 0) return null;

    const questionScores: Record<string, number[]> = {};

    responses.forEach((response) => {
      if (!response.answers) return;

      // Cast to the expected structure with proper type safety
      const answersObj = response.answers as unknown as Record<
        string,
        {
          rating: number | null;
          comment: string[];
          vote?: number;
          created_at: string;
          updated_at: string;
        }
      >;

      Object.entries(answersObj).forEach(([questionId, answer]) => {
        if (
          answer &&
          typeof answer === 'object' &&
          answer.rating !== null &&
          answer.rating !== undefined
        ) {
          if (!questionScores[questionId]) {
            questionScores[questionId] = [];
          }
          questionScores[questionId].push(answer.rating);
        }
      });
    });

    // Calculate average for each question
    const averageScores: Record<string, { average_score: number }> = {};

    Object.entries(questionScores).forEach(([questionId, scores]) => {
      if (scores.length > 0) {
        const sum = scores.reduce((acc, score) => acc + score, 0);
        const average = sum / scores.length;
        averageScores[questionId] = { average_score: average };
      }
    });

    return averageScores;
  };

  const getNextPhaseButtonText = () => {
    if (healthCheck?.current_step === LAST_STEP.key) return;
    if (healthCheck?.current_step === STEPS['survey'].key)
      return STEPS['discuss'].value;
    if (healthCheck?.current_step === STEPS['discuss'].key)
      return STEPS['review'].value;
    if (healthCheck?.current_step === STEPS['review'].key)
      return STEPS['close'].value;
  };

  const handleChangePhase = () => {
    if (healthCheck?.current_step === FIRST_STEP.key) {
      const averageScores = calculateAverageScores();

      if (averageScores && Object.keys(averageScores).length > 0) {
        updateHealthCheck({
          id: healthCheck.id,
          healthCheck: {
            current_step: (healthCheck?.current_step || 1) + 1,
            average_score: averageScores,
          },
        });
      }
    }
    if (healthCheck?.current_step !== LAST_STEP.key) {
      return updateHealthCheck({
        id: healthCheck?.id ?? '',
        healthCheck: {
          current_step: (healthCheck?.current_step || 1) + 1,
        },
      });
    }
    handleCompleteHealthCheck();
    router.push(`/teams/${healthCheck.team_id}`);
  };

  const isLoading =
    isLoadingUser ||
    isLoadingHealthCheck ||
    isLoadingResponses ||
    isLoadingActionItems ||
    isLoadingAgreements ||
    isLoadingIssues;

  if (isLoading || !template) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!healthCheck) {
    return <div>Health check not found</div>;
  }
  return (
    <Layout>
      <div className="flex w-full justify-between px-3 lg:px-0">
        <div className="w-full">
          <div className="flex w-full">
            <div className="mx-auto w-full p-2 md:p-4 lg:p-8">
              <div className="pb-6">
                <div className="flex items-center justify-center pt-3">
                  <HealthCheckSteps
                    currentStep={healthCheck.current_step || FIRST_STEP.key}
                    isFacilitator={isFacilitator}
                    handleChangeStep={handleChangeStep}
                  />
                </div>
              </div>
              <Card className="mx-auto w-full flex-shrink-0 overflow-hidden px-2 sm:px-4 md:px-6">
                <Timer
                  isFacilitator={isFacilitator}
                  healthCheckId={healthCheckId}
                  endTime={healthCheck.end_time || ''}
                />
                {healthCheck.current_step === STEPS['survey'].key && (
                  <SurveyTab
                    healthCheck={healthCheck as HealthCheckWithTemplate}
                    sections={sections}
                    currentUser={currentUser as unknown as User}
                    groupedQuestions={grouped}
                    minScore={template?.min_value}
                    maxScore={template?.max_value}
                    response={response}
                    settings={healthCheck.settings as HealthCheckSettings}
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
                  />
                )}
              </Card>
            </div>
            {healthCheck && (
              <WelcomeModal
                isOpen={isWelcomeModalOpen}
                onClose={closeWelcomeModal}
                healthCheck={healthCheck}
                template={template}
              />
            )}
          </div>
          {isFacilitator && (
            <div className={`mx-auto flex w-[50%] py-5`}>
              <Button
                className={`ml-auto w-full text-white sm:w-auto ${healthCheck?.current_step !== LAST_STEP.key ? 'bg-ces-orange-500 hover:bg-ces-orange-600' : ''}`}
                onClick={handleChangePhase}
              >
                {healthCheck?.current_step !== LAST_STEP.key
                  ? getNextPhaseButtonText()
                  : 'Exit Health Check'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
