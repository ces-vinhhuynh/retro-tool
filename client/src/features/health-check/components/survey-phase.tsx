'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CardContent } from '@/components/ui/card';

import { useHealthCheckMutations } from '../hooks/use-health-check';
import { useUpdateResponse } from '../hooks/use-response';
import { useUpdateParticipant } from '../hooks/use-update-participant';
import {
  AnswerSurvey,
  DisplayMode,
  GroupedQuestions,
  HealthCheckSettings,
  HealthCheckWithTemplate,
  Question,
  Response,
  Score,
  User,
} from '../types/health-check';

import { AllQuestionMode } from './survey/all-question-mode';
import { OneQuestionMode } from './survey/one-question-mode';
import { SectionBySectionMode } from './survey/section-by-section-mode';

interface QuestionAnswer {
  rating: number | null;
  comment: string[];
  vote?: number;
  created_at: string;
  updated_at: string;
}

type SurveyPhaseProps = {
  sections: string[];
  currentUser: User | null;
  groupedQuestions: GroupedQuestions;
  minScore: Score;
  maxScore: Score;
  response: Response | null | undefined;
  settings: HealthCheckSettings;
  healthCheck: HealthCheckWithTemplate;
  questions: Question[];
};

export const SurveyPhase = ({
  sections,
  currentUser,
  groupedQuestions,
  minScore,
  maxScore,
  response,
  settings,
  healthCheck,
  questions,
}: SurveyPhaseProps) => {
  const { id: healthCheckId } = useParams<{ id: string }>();
  const { updateHealthCheck } = useHealthCheckMutations();
  const isFacilitator =
    !!currentUser?.id && healthCheck?.facilitator_ids?.includes(currentUser.id);

  const [localGroupIndex, setLocalGroupIndex] = useState(
    healthCheck?.current_group_index ?? 0,
  );
  const [localQuestionIndex, setLocalQuestionIndex] = useState(
    healthCheck?.current_question_index ?? 0,
  );

  // Update local indices when health check updates (for facilitator-controlled navigation)
  useEffect(() => {
    if (!settings.allow_participant_navigation) {
      setLocalGroupIndex(healthCheck?.current_group_index ?? 0);
      setLocalQuestionIndex(healthCheck?.current_question_index ?? 0);
    }
  }, [
    healthCheck?.current_group_index,
    healthCheck?.current_question_index,
    settings.allow_participant_navigation,
  ]);

  const [answers, setAnswers] = useState<AnswerSurvey>({
    responses: (response?.answers as Record<string, number>) || {},
    comments: {},
  });

  const { mutate: updateQuestionAnswer } = useUpdateResponse();
  const { mutate: updateParticipant } = useUpdateParticipant();

  const saveAdditionalItemsImmediate = async (
    questionId: string,
    items: string[],
  ) => {
    if (response) {
      updateQuestionAnswer({
        id: response.id,
        questionId,
        answer: {
          comment: items.filter(Boolean),
        },
      });
    }
  };

  const onResponseChange = (questionId: string, value: number) => {
    setAnswers((prev) => {
      const newResponses = { ...prev.responses, [questionId]: value };
      if (response) {
        updateQuestionAnswer({
          id: response.id,
          questionId,
          answer: {
            rating: value,
          },
        });
      }

      return {
        ...prev,
        responses: newResponses,
      };
    });
  };

  const onCommentChange = (questionId: string, value: string[]) => {
    setAnswers((prev) => {
      const newComments = { ...prev.comments, [questionId]: value.join('\n') };
      if (response) {
        updateQuestionAnswer({
          id: response.id,
          questionId,
          answer: {
            comment: value,
          },
        });
      }

      return {
        ...prev,
        comments: newComments,
      };
    });
  };

  useEffect(() => {
    if (!response?.answers) return;
    const answersObj = response.answers as unknown as Record<
      string,
      QuestionAnswer
    >;
    const responses: Record<string, number> = {};
    const comments: Record<string, string> = {};

    Object.entries(answersObj).forEach(([questionId, answer]) => {
      if (answer?.rating != null) responses[questionId] = answer.rating;
      if (Array.isArray(answer.comment) && answer.comment.length > 0) {
        comments[questionId] = answer.comment.join('\n');
      }
    });

    setAnswers({ responses, comments });
  }, [response]);

  const totalQuestions = Object.values(groupedQuestions)
    .filter((questions) => questions[0]?.section !== 'Additional Questions')
    .reduce((sum, questions) => sum + questions.length, 0);

  const answeredQuestions = Object.keys(answers.responses).length;
  const progress =
    totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  useEffect(() => {
    if (currentUser?.id && healthCheckId) {
      updateParticipant({
        healthCheckId,
        userId: currentUser.id,
        updates: { progress: Math.round(progress) },
      });
    }
  }, [progress, currentUser?.id, healthCheckId, updateParticipant]);

  const handleAddAdditionalComment = (
    questionId: string,
    newComment: string,
  ) => {
    if (!newComment) return;

    const oldComments = response?.answers?.[questionId]?.comment || [];
    const updatedComments = [...oldComments, newComment];

    saveAdditionalItemsImmediate(questionId, updatedComments);
  };

  const handleChangeAdditionalComment = (
    questionId: string,
    index: number,
    value: string,
  ) => {
    const comments = response?.answers?.[questionId]?.comment || [];
    const updatedComments = comments.map((item, i) =>
      i === index ? value : item,
    );

    saveAdditionalItemsImmediate(questionId, updatedComments);
  };

  const handleDeleteAdditionalComment = async (
    questionId: string,
    index: number,
  ) => {
    const comments = response?.answers?.[questionId]?.comment || [];
    const updatedComments = comments.filter((_, i) => i !== index);

    saveAdditionalItemsImmediate(questionId, updatedComments);
  };

  const updateGroupIndex = (newIndex: number) => {
    if (settings.allow_participant_navigation) {
      setLocalGroupIndex(newIndex);
    } else if (isFacilitator) {
      updateHealthCheck({
        id: healthCheckId,
        healthCheck: { current_group_index: newIndex },
      });
    }
  };

  const updateQuestionIndex = (newIndex: number) => {
    if (settings.allow_participant_navigation) {
      setLocalQuestionIndex(newIndex);
    } else if (isFacilitator) {
      updateHealthCheck({
        id: healthCheckId,
        healthCheck: { current_question_index: newIndex },
      });
    }
  };

  const handleNavigation = (newIndex: number) => {
    if (settings.display_mode === DisplayMode.GROUPED) {
      if (newIndex !== localGroupIndex) {
        updateGroupIndex(newIndex);
      }
      return;
    }

    if (settings.display_mode === DisplayMode.SINGLE) {
      if (newIndex !== localQuestionIndex) {
        updateQuestionIndex(newIndex);
      }
    }
  };

  const sharedProps = {
    sections,
    groupedQuestions,
    minScore,
    maxScore,
    answers,
    onResponseChange,
    onCommentChange,
    handleAddAdditionalComment,
    handleChangeAdditionalComment,
    handleDeleteAdditionalComment,
    allowParticipantNavigation: settings.allow_participant_navigation,
    isFacilitator: !!isFacilitator,
    handleNavigation: handleNavigation,
    currentGroupIndex: settings.allow_participant_navigation
      ? localGroupIndex
      : (healthCheck?.current_group_index ?? 0),
    currentQuestionIndex: settings.allow_participant_navigation
      ? localQuestionIndex
      : (healthCheck?.current_question_index ?? 0),
  };

  return (
    <CardContent className="p-0">
      {settings.display_mode === DisplayMode.SINGLE && (
        <OneQuestionMode {...sharedProps} questions={questions} />
      )}
      {settings.display_mode === DisplayMode.ALL && (
        <AllQuestionMode {...sharedProps} />
      )}
      {settings.display_mode === DisplayMode.GROUPED && (
        <SectionBySectionMode {...sharedProps} />
      )}
    </CardContent>
  );
};
