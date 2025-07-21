'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import { FormattedHealthCheck } from '../types/health-check';
import { formatDateTime } from '../utils/time-format';

interface HealthCheckBreakdownHeaderProps {
  healthChecks: FormattedHealthCheck[];
  isShowAddNew?: boolean;
  onAddNewSession?: () => void;
}

export const HealthCheckBreakdownHeader = ({
  healthChecks,
  isShowAddNew = false,
  onAddNewSession,
}: HealthCheckBreakdownHeaderProps) => {
  return (
    <div className="flex border-b border-gray-200">
      <div
        className={cn('w-32 md:w-56 lg:w-68', {
          'w-20': isShowAddNew,
        })}
      >
        <div className="h-24 border-r border-gray-200" />
      </div>

      <div className="flex-1">
        <div
          className="grid h-24"
          style={{
            gridTemplateColumns: `repeat(${healthChecks.length}, 1fr)`,
          }}
        >
          {healthChecks.map((healthCheck) => (
            <div
              key={healthCheck.id}
              className="flex flex-col items-center justify-center gap-1 border border-gray-200 px-2 last:border-r-0"
            >
              <Link
                href={`/health-checks/${healthCheck.id}`}
                className="flex w-full flex-col items-center gap-1 text-center"
              >
                <h2 className="max-w-full truncate text-sm font-bold sm:text-base lg:text-lg">
                  {healthCheck.title}
                </h2>
                <p className="text-xs text-gray-500 sm:text-sm">
                  {formatDateTime(new Date(String(healthCheck.createdAt)))}
                </p>
                <div className="rounded bg-gray-200 px-1 text-xs capitalize sm:px-2">
                  {healthCheck?.status}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {isShowAddNew && (
        <div className="h-24 w-24 flex-shrink-0 border border-gray-200 bg-blue-50 sm:w-32 lg:w-40">
          <Button
            variant="ghost"
            className="flex h-full w-full flex-col items-center gap-2 hover:bg-blue-50"
            onClick={onAddNewSession}
          >
            <Plus className="h-4 w-4 text-blue-400 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            <h2 className="text-xs font-medium text-blue-400 sm:text-sm lg:text-base">
              Start New
            </h2>
          </Button>
        </div>
      )}
    </div>
  );
};
