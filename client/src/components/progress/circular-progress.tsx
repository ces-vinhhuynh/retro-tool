'use client';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { CircularSvg } from './circular-svg';

interface CircularProgressProps {
  value: number;
  renderLabel?: (progress: number) => number | string;
  size?: number;
  strokeWidth?: number;
  circleStrokeWidth?: number;
  progressStrokeWidth?: number;
  shape?: 'square' | 'round';
  className?: string;
  progressClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
}
const CircularProgress = ({
  value,
  renderLabel,
  className,
  progressClassName,
  labelClassName,
  showLabel,
  shape = 'round',
  size,
  strokeWidth,
  circleStrokeWidth = 10,
  progressStrokeWidth = 10,
}: CircularProgressProps) => {
  return (
    <div className="relative">
      <CircularSvg
        value={value}
        size={size}
        shape={shape}
        circleStrokeWidth={circleStrokeWidth}
        progressStrokeWidth={progressStrokeWidth}
        strokeWidth={strokeWidth}
        className={className}
        progressClassName={progressClassName}
      />
      {showLabel && (
        <div
          className={cn(
            'text-md absolute inset-0 flex items-center justify-center',
            labelClassName,
          )}
        >
          {renderLabel ? renderLabel(value) : value}
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
