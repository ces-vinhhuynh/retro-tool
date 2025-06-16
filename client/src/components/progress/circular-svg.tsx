'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface CircularSvgProps {
  value: number;
  size?: number;
  shape?: 'square' | 'round';
  circleStrokeWidth?: number;
  progressStrokeWidth?: number;
  strokeWidth?: number;
  className?: string;
  progressClassName?: string;
}

export const CircularSvg = ({
  value,
  size = 100,
  shape = 'round',
  strokeWidth,
  circleStrokeWidth = 10,
  progressStrokeWidth = 10,
  className,
  progressClassName,
}: CircularSvgProps) => {
  const radius = 50 - Math.max(circleStrokeWidth, progressStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - progress / 100);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: 'rotate(-90deg)' }}
      className="relative"
    >
      {/* Base Circle */}
      <circle
        r={radius}
        cx={50}
        cy={50}
        fill="transparent"
        strokeWidth={strokeWidth ?? circleStrokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={0}
        className={cn('stroke-primary/25', className)}
      />
      {/* Progress */}
      <circle
        r={radius}
        cx={50}
        cy={50}
        strokeWidth={strokeWidth ?? progressStrokeWidth}
        strokeLinecap={shape}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        fill="transparent"
        className={cn('stroke-primary', progressClassName)}
      />
    </svg>
  );
};
