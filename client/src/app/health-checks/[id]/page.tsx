'use client';

import _groupBy from 'lodash.groupby';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Layout } from '@/components/layout/layout';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import DiscussPhase from '@/features/health-check/components/discuss-phase';
import HealthCheckSteps from '@/features/health-check/components/health-check-steps';
import ReviewPhase from '@/features/health-check/components/review-phase';
import { WelcomeModal } from '@/features/health-check/components/sessions/welcome-modal';
import SurveyTab from '@/features/health-check/components/survey-tab';
import {
  FIRST_STEP,
  STEPS,
} from '@/features/health-check/constants/health-check';
import { useGetActionItems } from '@/features/health-check/hooks/use-get-action-items';
import {
  useHealthCheckWithTemplate,
  useHealthCheckMutations,
} from '@/features/health-check/hooks/use-health-check';
import { useHealthCheckSubscription } from '@/features/health-check/hooks/use-health-check-subscription';
import { useTemplateById } from '@/features/health-check/hooks/use-health-check-templates';
import {
  useCreateResponse,
  useResponse,
  useResponses,
} from '@/features/health-check/hooks/use-response';
import { useResponsesSubscription } from '@/features/health-check/hooks/use-response-subcription';
import {
  HealthCheckWithTemplate,
  Question,
} from '@/features/health-check/types/health-check';

export type GroupedQuestions = {
  [section: string]: Question[];
};

export default function HealthCheckPage() {
  const params = useParams();
  const healthCheckId = params.id as string;

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
    useGetActionItems(healthCheckId);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const { updateHealthCheck } = useHealthCheckMutations();
  const { mutate: createResponse } = useCreateResponse();

  useHealthCheckSubscription(healthCheckId);
  useResponsesSubscription(healthCheckId);

  const questions: Question[] = template?.questions || [];
  const grouped = _groupBy(questions, 'section');
  const sections = Object.keys(grouped);
  const isFacilitator = currentUser?.id === healthCheck?.facilitator_id;

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
      const modalShownKey = `welcome-modal-shown-${healthCheckId}`;
      const hasSeenModal = localStorage.getItem(modalShownKey);

      if (!hasSeenModal) {
        setShowWelcomeModal(true);
        localStorage.setItem(modalShownKey, 'true');
      }
    }
  }, [
    currentUser,
    healthCheck,
    isLoadingUser,
    isLoadingHealthCheck,
    healthCheckId,
  ]);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
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

  const isLoading =
    isLoadingUser ||
    isLoadingHealthCheck ||
    isLoadingResponses ||
    isLoadingActionItems;

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
      <div className="py-6">
        <div className="flex items-center justify-center">
          <HealthCheckSteps
            currentStep={healthCheck.current_step || FIRST_STEP.key}
            isFacilitator={isFacilitator}
            handleChangeStep={handleChangeStep}
          />
        </div>
      </div>
      {healthCheck.current_step === STEPS['survey'].key && (
        <SurveyTab
          sections={sections}
          groupedQuestions={grouped}
          minScore={template?.min_value.value}
          maxScore={template?.max_value.value}
          response={response}
        />
      )}
      {healthCheck.current_step === STEPS['discuss'].key && (
        <DiscussPhase
          healthCheck={healthCheck as HealthCheckWithTemplate}
          questions={questions}
          responses={responses || []}
          actionItems={actionItems || []}
        />
      )}
      {healthCheck.current_step === STEPS['review'].key && (
        <ReviewPhase
          healthCheck={healthCheck as HealthCheckWithTemplate}
          actionItems={actionItems || []}
        />
      )}
      {healthCheck.current_step === STEPS['close'].key}

      {healthCheck && (
        <WelcomeModal
          isOpen={showWelcomeModal}
          onClose={handleCloseWelcomeModal}
          healthCheck={healthCheck}
          template={template}
        />
      )}
    </Layout>
  );
}
