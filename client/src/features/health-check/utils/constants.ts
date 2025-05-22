// features/health-check/constants/action-items.ts
import {
  Circle,
  Clock,
  CheckCircle,
  XCircle,
  Equal,
  ChevronsDown,
  ChevronsUp,
} from 'lucide-react';

import { ActionPriority, ActionStatus } from '../types/health-check';
export const STATUS_CONFIG = {
  [ActionStatus.TODO]: {
    icon: Circle,
    label: 'To Do',
    className: 'text-gray-400',
  },
  [ActionStatus.IN_PROGRESS]: {
    icon: Clock,
    label: 'In Progress',
    className: 'text-blue-500',
  },
  [ActionStatus.DONE]: {
    icon: CheckCircle,
    label: 'Completed',
    className: 'text-green-500 fill-green-500',
  },
  [ActionStatus.BLOCKED]: {
    icon: XCircle,
    label: 'Blocked',
    className: 'text-red-500',
  },
} as const;

export const PRIORITY_CONFIG = {
  [ActionPriority.HIGH]: {
    icon: ChevronsUp,
    label: 'High',
    className: 'text-red-500',
  },
  [ActionPriority.MEDIUM]: {
    icon: Equal,
    label: 'Medium',
    className: 'text-amber-500',
  },
  [ActionPriority.LOW]: {
    icon: ChevronsDown,
    label: 'Low',
    className: 'text-blue-500',
  },
} as const;

export const STEPS = {
  survey: { key: 1, value: 'Survey' },
  discuss: { key: 2, value: 'Discuss' },
  review: { key: 3, value: 'Review' },
  close: { key: 4, value: 'Close' },
};

export const HEALTH_CHECK_LIMIT = 4;

export const RATING_OPTIONS = [
  {
    value: 1,
    label: 'DEFINITELY NOT',
    description: 'A waste of my time',
    color: 'bg-red-500',
  },
  {
    value: 2,
    label: 'NOT REALLY',
    description: 'Useful, but not worth all of my time',
    color: 'bg-orange-400',
  },
  {
    value: 3,
    label: 'SOMEWHAT',
    description: 'I gained enough to spend my time on it',
    color: 'bg-teal-500',
  },
  {
    value: 4,
    label: 'MOSTLY',
    description: 'I gained more value than the time I spent',
    color: 'bg-lime-400',
  },
  {
    value: 5,
    label: 'ABSOLUTELY',
    description: 'I gained a lot of value and it was absolutely worth my time',
    color: 'bg-green-500',
  },
] as const;

export const SUBMENU_ITEMS = {
  PROGRESS_BAR: 'progress-bar',
  ACTIONS: 'actions',
  AGREEMENT: 'agreement',
  ISSUES: 'issues',
} as const;
