'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { useHealthCheckMutations } from '../hooks/use-health-check';
import { useUpdateResponse } from '../hooks/use-response';
import { useUpdateParticipant } from '../hooks/use-update-participant';
import {
  AnswerSurvey,
  DisplayMode,
  GroupedQuestions,
  HealthCheckSettings,
  HealthCheckWithTemplate,
  Response,
  Score,
  User,
} from '../types/health-check';

import AllQuestionMode from './survey/all-question-mode';
import OneQuestionMode from './survey/one-question-mode';
import SectionBySectionMode from './survey/section-by-section-mode';

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
  isLoading: boolean;
};

const SurveyPhase = ({
  sections,
  currentUser,
  groupedQuestions,
  minScore,
  maxScore,
  response,
  settings,
  healthCheck,
  isLoading,
}: SurveyPhaseProps) => {
  const { id: healthCheckId } = useParams<{ id: string }>();
  const { updateHealthCheck } = useHealthCheckMutations();
  const isFacilitator = currentUser?.id === healthCheck?.facilitator_id;

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

  const [additionalItems, setAdditionalItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [answers, setAnswers] = useState<AnswerSurvey>({
    responses: (response?.answers as Record<string, number>) || {},
    comments: {},
  });

  const { mutate: updateQuestionAnswer } = useUpdateResponse();
  const { mutate: updateParticipant } = useUpdateParticipant();

  const additionalQuestions = useMemo(
    () => groupedQuestions['Additional Questions'] || [],
    [groupedQuestions],
  );

  const saveAdditionalItemsImmediate = async (items: string[]) => {
    if (response && additionalQuestions.length > 0) {
      const questionId = additionalQuestions[0].id;

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

    if (additionalQuestions.length > 0) {
      const questionId = additionalQuestions[0].id;
      const additionalAnswer = answersObj[questionId];
      if (Array.isArray(additionalAnswer?.comment)) {
        setAdditionalItems([...additionalAnswer.comment]);
      }
    }
  }, [response, additionalQuestions]);

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

  const additionalTitle = additionalQuestions[0]?.title ?? 'Title';
  const additionalDescription = additionalQuestions[0]?.description ?? '';

  const handleAdditionalItem = async () => {
    if (!newItem.trim()) return;
    const updated = [...additionalItems, newItem.trim()];
    setNewItem('');
    setAdditionalItems(updated);
    await saveAdditionalItemsImmediate(updated);
  };

  const handleItemChange = async (index: number, value: string) => {
    const updatedItems = additionalItems.map((item, i) =>
      i === index ? value : item,
    );
    setAdditionalItems(updatedItems);
    await saveAdditionalItemsImmediate(updatedItems);
  };

  const handleDeleteItem = async (index: number) => {
    const updatedItems = additionalItems.filter((_, i) => i !== index);
    setAdditionalItems(updatedItems);
    await saveAdditionalItemsImmediate(updatedItems);
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
    additionalTitle,
    additionalDescription,
    additionalItems,
    newItem,
    handleAdditionalItem,
    setNewItem,
    handleItemChange,
    handleDeleteItem,
    allowParticipantNavigation: settings.allow_participant_navigation,
    isFacilitator,
    handleNavigation: handleNavigation,
    currentGroupIndex: settings.allow_participant_navigation
      ? localGroupIndex
      : (healthCheck?.current_group_index ?? 0),
    currentQuestionIndex: settings.allow_participant_navigation
      ? localQuestionIndex
      : (healthCheck?.current_question_index ?? 0),
  };

  return (
    <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <>
          <div className="min-w-0 flex-shrink-0 pb-2 md:w-1/2 lg:w-1/3">
            <Progress value={progress} className="h-2" />
            <div className="text-muted-foreground text-right text-sm">
              {Math.round(progress)}%
            </div>
          </div>

          {settings.display_mode === DisplayMode.SINGLE && (
            <OneQuestionMode {...sharedProps} />
          )}
          {settings.display_mode === DisplayMode.ALL && (
            <AllQuestionMode {...sharedProps} />
          )}
          {settings.display_mode === DisplayMode.GROUPED && (
            <SectionBySectionMode {...sharedProps} />
          )}
        </>
      )}
    </CardContent>
  );
};

export default SurveyPhase;
