'use client';

import { AlarmClock, Minus, Play, Plus, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useHealthCheckMutations } from '../hooks/use-health-check';
import { TIMER_CONFIG } from '../utils/constants';
import { formatTime, getEndTime } from '../utils/time-format';

interface TimerProps {
  isFacilitator: boolean;
  healthCheckId: string;
  endTime: string;
}

const Timer = ({ isFacilitator, healthCheckId, endTime }: TimerProps) => {
  const [setupTime, setSetupTime] = useState(TIMER_CONFIG.DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { updateHealthCheck } = useHealthCheckMutations();

  useEffect(() => {
    if (isRunning && setupTime > TIMER_CONFIG.MIN_TIME) {
      intervalRef.current = setInterval(() => {
        setSetupTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, setupTime]);

  useEffect(() => {
    // Recalculate time left whenever endTime changes
    setSetupTime(getEndTime(endTime));
    setIsRunning(!!endTime);
  }, [endTime]);

  const handleStart = () => {
    if (setupTime > TIMER_CONFIG.MIN_TIME && isFacilitator) {
      setIsRunning(true);
      const endTime = new Date(Date.now() + setupTime * 1000).toISOString();
      updateHealthCheck({
        id: healthCheckId,
        healthCheck: {
          end_time: endTime,
          updated_at: new Date().toISOString(),
        },
      });
    }
  };

  const handleReset = () => {
    if (isFacilitator) {
      setIsRunning(false);
      setSetupTime(TIMER_CONFIG.DEFAULT_TIME);

      updateHealthCheck({
        id: healthCheckId,
        healthCheck: {
          end_time: null,
          updated_at: new Date().toISOString(),
        },
      });
    }
  };

  const adjustTime = (increment: boolean) => {
    if (isRunning) return;

    setSetupTime((prev) => {
      const newValue = increment
        ? prev + TIMER_CONFIG.INCREMENT
        : prev - TIMER_CONFIG.INCREMENT;
      return Math.max(
        TIMER_CONFIG.MIN_TIME,
        Math.min(TIMER_CONFIG.MAX_TIME, newValue),
      );
    });
  };

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center space-x-2">
          {!isRunning && isFacilitator && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-ces-orange-100 h-6 w-6 rounded-full"
              onClick={() => adjustTime(false)}
              disabled={setupTime <= TIMER_CONFIG.MIN_TIME}
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}
          {(isRunning || !isFacilitator) && (
            <AlarmClock
              className={cn(
                'h-8 w-8',
                setupTime < TIMER_CONFIG.WARNING_TIME
                  ? 'text-red-600'
                  : 'text-blue-300',
              )}
            />
          )}
          <div className="min-w-20 text-center text-lg font-light text-gray-800 tabular-nums">
            {formatTime(setupTime)}
          </div>
          {!isRunning && isFacilitator && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-ces-orange-100 h-6 w-6 rounded-full"
              onClick={() => adjustTime(true)}
              disabled={setupTime >= TIMER_CONFIG.MAX_TIME}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isFacilitator && (
          <Button
            variant="ghost"
            onClick={isRunning ? handleReset : handleStart}
            disabled={
              (!isRunning && setupTime === TIMER_CONFIG.MIN_TIME) ||
              !isFacilitator
            }
            className="text-md text-ces-orange-400 hover:text-ces-orange-500 h-8 w-8 rounded-full font-medium hover:bg-white"
          >
            {isRunning ? (
              <RotateCcw className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Timer;
