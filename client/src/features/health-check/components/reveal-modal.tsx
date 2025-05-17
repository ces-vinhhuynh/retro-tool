import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ResponseWithUser } from '../types/health-check';
import { RATING_OPTIONS } from '../utils/constants';

import { ResponseStatus } from './response-status';

interface RevealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  responses: ResponseWithUser[];
  respondedCount: number;
  teamSize: number;
}

export default function RevealModal({
  open,
  onOpenChange,
  responses,
  respondedCount,
  teamSize,
}: RevealModalProps) {
  const getUsersByRating = (rating: number) => {
    return responses
      .filter((response) => response.health_check_rating === rating)
      .map((response) => ({
        id: response.user_id,
        name: response.user?.full_name || 'Anonymous',
        avatar: response.user?.avatar_url,
        email: response.user?.email,
      }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Health Check Results</DialogTitle>
        <TooltipProvider>
          {RATING_OPTIONS.map((option) => {
            const ratingUsers = getUsersByRating(option.value);

            return (
              <div key={option.value} className="flex items-center gap-3">
                <div className="w-32 text-right font-medium">
                  {option.label}
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${option.color}`}
                >
                  {option.value}
                </div>

                <div className="flex items-center gap-1">
                  {ratingUsers.length > 0 ? (
                    ratingUsers.map((user) => (
                      <Tooltip key={user.id}>
                        <TooltipTrigger asChild>
                          <Avatar className="border-2 border-white">
                            {user.avatar ? (
                              <AvatarImage src={user.avatar} alt={user.name} />
                            ) : (
                              <AvatarFallback className="bg-ces-orange-500 text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{user.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">No votes</span>
                  )}
                </div>
              </div>
            );
          })}
        </TooltipProvider>

        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <ResponseStatus
              respondedCount={respondedCount}
              teamSize={teamSize}
            />
          </div>

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hide Results
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
