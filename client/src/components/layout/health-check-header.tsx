'use client';

import { ChevronDown, Settings, UserPlus } from 'lucide-react';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { SettingDialog } from '@/features/health-check/components/setting-dialog';
import { Timer } from '@/features/health-check/components/timer';
import { useGetParticipants } from '@/features/health-check/hooks/use-get-participants';
import {
  useHealthCheckMutations,
  useHealthCheckWithTemplate,
} from '@/features/health-check/hooks/use-health-check';
import { useGetTemplateById } from '@/features/health-check/hooks/use-health-check-templates';
import { useResponse } from '@/features/health-check/hooks/use-response';
import { useUpdateAverageScores } from '@/features/health-check/hooks/use-update-average-scores';
import { useWelcomeModalStore } from '@/features/health-check/stores/welcome-modal-store';
import {
  Question,
  HealthCheckSettings,
} from '@/features/health-check/types/health-check';
import { FIRST_STEP, STEPS } from '@/features/health-check/utils/constants';
import { cn } from '@/utils/cn';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Progress } from '../ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export const HealthCheckHeader = () => {
  const { id: healthCheckId } = useParams<{ id: string }>();

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
  const { data: participants } = useGetParticipants(healthCheckId);

  const { updateHealthCheck } = useHealthCheckMutations();
  const { mutate: updateAverageScores } = useUpdateAverageScores();
  const { open: openWelcomeModal } = useWelcomeModalStore();

  const isFacilitator =
    !!currentUser?.id && healthCheck?.facilitator_ids?.includes(currentUser.id);
  const currentStep = healthCheck?.current_step || FIRST_STEP.key;
  const currentStepObj = Object.values(STEPS).find(
    (step) => step.key === currentStep,
  );
  const questions: Question[] = (template?.questions as Question[]) || [];
  const questionsCount = questions.filter(
    ({ section }) => section !== 'Additional Questions',
  ).length;
  const ratingCount = Object.values(response?.answers || {}).filter(
    (answer) => (answer as { rating?: number })?.rating != null,
  ).length;
  const progress =
    questionsCount > 0 ? (ratingCount / questionsCount) * 100 : 0;

  const handleChangeStep = (newStep: keyof typeof STEPS) => {
    if (healthCheck?.current_step !== 1) {
      updateHealthCheck({
        id: healthCheckId,
        healthCheck: { current_step: STEPS[newStep].key },
      });
      return;
    }

    updateAverageScores({ healthCheckId: healthCheck.id });
    updateHealthCheck({
      id: healthCheck.id,
      healthCheck: {
        current_step: STEPS[newStep].key,
      },
    });
  };

  const handleInviteUser = () => {
    openWelcomeModal(healthCheckId);
  };

  const handleUpdateHealthCheckSettings = (settings: HealthCheckSettings) => {
    updateHealthCheck({
      id: healthCheck?.id || '',
      healthCheck: { settings },
    });
  };

  if (
    isLoadingUser ||
    isLoadingHealthCheck ||
    isLoadingTemplate ||
    isLoadingResponse
  )
    return <></>;

  return (
    <div className="lg:max-w-screen-3xl w-full px-5 pb-3">
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
        {/* Desktop */}
        <div className="hidden items-center gap-3 md:flex xl:flex-1 xl:justify-start">
          <ol className="flex gap-1">
            {Object.values(STEPS).map(({ key }, index) => (
              <li key={key}>
                <Button
                  className={cn('h-5 w-13 rounded-full bg-gray-200', {
                    'bg-rhino-500 text-primary': key === currentStep,
                    'cursor-pointer': isFacilitator,
                  })}
                  onClick={() => {
                    handleChangeStep(
                      Object.keys(STEPS)[index] as keyof typeof STEPS,
                    );
                  }}
                  disabled={!isFacilitator || key === currentStep}
                />
              </li>
            ))}
          </ol>
          <div className="flex flex-col">
            <p className="text-primary-text font-bold">
              {currentStepObj?.value}
            </p>
            <p className="text-secondary-text">
              Step{' '}
              <span className="text-primary-text font-bold">{currentStep}</span>{' '}
              of 5
            </p>
          </div>
        </div>

        {/* Mobile select */}
        <div className="md:hidden">
          <Select
            value={(currentStep - 1).toString()}
            onValueChange={(value) => {
              handleChangeStep(
                Object.keys(STEPS)[parseInt(value)] as keyof typeof STEPS,
              );
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(STEPS).map(({ key, value }, index) => (
                <SelectItem key={key} value={index.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-shrink-0">
          <Timer
            isFacilitator={!!isFacilitator}
            healthCheckId={healthCheckId}
            endTime={healthCheck?.end_time || ''}
          />
        </div>

        {isFacilitator && (
          <div className="flex flex-shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="ml-2 flex items-center"
              onClick={handleInviteUser}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
            {isFacilitator && (
              <div className="flex items-center gap-2">
                <SettingDialog
                  settings={healthCheck?.settings as HealthCheckSettings}
                  onChange={handleUpdateHealthCheckSettings}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        )}

        <div className="flex w-full items-center justify-end gap-3 md:w-auto md:min-w-0 xl:flex-1 xl:justify-end">
          {currentStep === 1 && (
            <div className="flex w-full flex-col md:w-32 lg:w-48 xl:w-56">
              <p className="text-secondary-text text-right text-sm">
                {ratingCount} / {questionsCount}
              </p>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex-shrink-0">
                Detail <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <ul className="flex flex-col gap-2">
                {participants?.map((participant) => (
                  <div key={participant.user_id} className="flex gap-3">
                    <Avatar>
                      <AvatarImage
                        src={participant.user.avatar_url ?? ''}
                        alt={participant.user.full_name ?? 'User'}
                        className="h-8 w-8 bg-gray-300"
                      />
                      <AvatarFallback>
                        {participant.user.full_name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium">
                          {participant.user.full_name}
                        </p>
                      </div>
                      <div className="mt-1 w-full">
                        <Progress
                          value={participant.progress}
                          className="h-1.5"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
