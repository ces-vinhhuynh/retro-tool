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
    className: 'text-green-500 fill-white',
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
  openActions: { key: 2, value: 'Open Actions' },
  discuss: { key: 3, value: 'Discuss' },
  review: { key: 4, value: 'Review' },
  close: { key: 5, value: 'Close' },
};

export const FIRST_STEP = STEPS['survey'];
export const LAST_STEP = STEPS['close'];

export const HEALTH_CHECK_LIMIT = 4;

export const RATING_OPTIONS = [
  {
    value: 1,
    label: 'TERRIBLE',
    description: 'A complete waste of time',
    color: 'bg-red-600',
  },
  {
    value: 2,
    label: 'POOR',
    description: 'Not useful and barely worth the effort',
    color: 'bg-orange-500',
  },
  {
    value: 3,
    label: 'FAIR',
    description: 'Some value, but overall disappointing',
    color: 'bg-yellow-400',
  },
  {
    value: 4,
    label: 'BELOW AVERAGE',
    description: 'Slightly useful, but not quite worth it',
    color: 'bg-lime-400',
  },
  {
    value: 5,
    label: 'AVERAGE',
    description: 'Neutral — neither great nor bad',
    color: 'bg-amber-300',
  },
  {
    value: 6,
    label: 'ABOVE AVERAGE',
    description: 'Generally useful and worth the time',
    color: 'bg-green-400',
  },
  {
    value: 7,
    label: 'GOOD',
    description: 'Clearly valuable and time well spent',
    color: 'bg-emerald-500',
  },
  {
    value: 8,
    label: 'VERY GOOD',
    description: 'Provided strong value, exceeded expectations',
    color: 'bg-teal-500',
  },
  {
    value: 9,
    label: 'EXCELLENT',
    description: 'Highly valuable and impactful',
    color: 'bg-cyan-600',
  },
  {
    value: 10,
    label: 'OUTSTANDING',
    description: 'Extremely valuable — could not be better',
    color: 'bg-blue-700',
  },
] as const;

export const SUBMENU_ITEMS = {
  PROGRESS_BAR: 'progress-bar',
  ACTIONS: 'actions',
  AGREEMENT: 'agreement',
  ISSUES: 'issues',
  CUSTOMIZE: 'customize',
} as const;

export type HealthCheckTab = 'general' | 'options';

export const HEALTH_CHECK_TABS = [
  { id: 'general', label: 'GENERAL' },
  { id: 'options', label: 'OPTIONS' },
];

export const TIMER_CONFIG = {
  DEFAULT_TIME: 5 * 60,
  MIN_TIME: 0,
  MAX_TIME: 59 * 60 + 59,
  INCREMENT: 30,
  WARNING_TIME: 60,
} as const;

export const HEALTH_CHECK_ROLE_OPTIONS = [
  {
    value: 'facilitator',
    label: 'Facilitator',
    description:
      'Modify health check settings, move between phases and invite participants, as well as contributing survey responses.',
  },
  {
    value: 'participant',
    label: 'Participant',
    description: 'Contribute survey responses only.',
  },
];
