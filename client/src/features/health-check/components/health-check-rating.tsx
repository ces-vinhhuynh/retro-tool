'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';

import { useUpdateHealthCheckRating } from '../hooks/use-update-health-check-rating';
import { ResponseWithUser, User } from '../types/health-check';
import { RATING_OPTIONS } from '../utils/constants';

import RatingOption from './rating-option';
import { ResponseStatus } from './response-status';
import RevealModal from './reveal-modal';

interface SessionReviewProps {
  teamSize: number;
  responses: ResponseWithUser[];
  currentUser: User;
}

export function HealthCheckRating({
  teamSize,
  responses,
  currentUser,
}: SessionReviewProps) {
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
    <div className="rounded-lg bg-white p-6">
      <h2 className="py-3 text-2xl font-bold text-gray-900">Meeting Rating</h2>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h2 className="text-center text-xl font-semibold">
          Was this meeting worth your time?
        </h2>

        <div className="overflow-hidden bg-blue-100">
          <div className="grid grid-cols-5">
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
}
