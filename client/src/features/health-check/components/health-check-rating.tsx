'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { useUpdateHealthCheckRating } from '../hooks/use-update-health-check-rating';
import { ResponseWithUser, User } from '../types/health-check';
import { getScoreColors } from '../utils/color';
import { RATING_OPTIONS } from '../utils/constants';

import RatingOption from './rating-option';
import { ResponseStatus } from './response-status';
import RevealModal from './reveal-modal';

interface SessionReviewProps {
  teamSize: number;
  responses: ResponseWithUser[];
  currentUser: User;
}

const HealthCheckRating = ({
  teamSize,
  responses,
  currentUser,
}: SessionReviewProps) => {
  const currentUserResponse = responses.find(
    (response) => response.user_id === currentUser?.id,
  );
  const { mutate: updateRating } = useUpdateHealthCheckRating();
  const [selectedRating, setSelectedRating] = useState<number | null>(
    currentUserResponse?.health_check_rating || null,
  );
  const [revealModalOpen, setRevealModalOpen] = useState(false);

  const respondedCount = responses.filter(
    (response) => response.health_check_rating !== null,
  ).length;

  const handleRatingSelect = (rating: number) => {
    if (!currentUserResponse?.id) return;

    if (selectedRating === rating) {
      setSelectedRating(null);
      updateRating({
        responseId: currentUserResponse.id,
      });
    } else {
      setSelectedRating(rating);
      updateRating({
        responseId: currentUserResponse.id,
        healthCheckRating: rating,
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 overflow-x-auto rounded-lg bg-white p-6">
      <h2 className="py-3 text-2xl font-bold text-gray-900">Meeting Rating</h2>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h2 className="text-center text-xl font-semibold">
          Was this meeting worth your time?
        </h2>

        <div className="hidden overflow-hidden bg-blue-100 md:block">
          <div className="grid grid-cols-5 items-center">
            <TooltipProvider>
              {RATING_OPTIONS.map((option) => (
                <RatingOption
                  key={option.value}
                  option={option}
                  isSelected={selectedRating === option.value}
                  onSelect={handleRatingSelect}
                />
              ))}
            </TooltipProvider>
          </div>
        </div>
        <div className="pb-2 flex w-full flex-col gap-2 sm:block md:hidden">
          <Slider
            min={RATING_OPTIONS[0].value}
            max={RATING_OPTIONS.at(-1)?.value ?? 0}
            step={1}
            value={[selectedRating ?? RATING_OPTIONS[0].value]}
            onValueChange={([val]) => handleRatingSelect(val)}
            className="w-full"
            thumbClassName={getScoreColors(selectedRating ?? 0)?.circle}
          />
          <div className="flex justify-between text-xs">
            {RATING_OPTIONS.map(({ value }) => (
              <span
                key={value}
                className={cn('font-bold', {
                  [getScoreColors(value)?.text ?? '']: selectedRating === value,
                  'text-gray-500': selectedRating !== value,
                })}
              >
                {value}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <ResponseStatus
              respondedCount={respondedCount}
              teamSize={teamSize}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setRevealModalOpen(true)}>
              Reveal results
            </Button>
          </div>
        </div>
      </div>
      <RevealModal
        open={revealModalOpen}
        onOpenChange={setRevealModalOpen}
        responses={responses}
        teamSize={teamSize}
        respondedCount={respondedCount}
      />
    </div>
  );
};

export default HealthCheckRating;
