import {
  BadgeAlert,
  CalendarCheck,
  Handshake,
  LineChart,
  SquareCheckBig,
  Users,
} from 'lucide-react';

export const FLOATING_HEALTH_CHECK_BUTTON = {
  name: 'FLOATING_HEALTH_CHECK_BUTTON',
  title: 'Return to Latest Health Check',
};

// Project navigation items
export const PROJECT_NAVIGATION_ITEMS = [
  {
    title: 'Health Checks',
    icon: CalendarCheck,
    tab: 'health-checks',
  },
  {
    title: 'Data Track',
    icon: LineChart,
    tab: 'data-track',
  },
  {
    title: 'Team Actions',
    icon: SquareCheckBig,
    tab: 'actions',
  },
  {
    title: 'Long Term Issues',
    icon: BadgeAlert,
    tab: 'long-term-issues',
  },
  {
    title: 'Team Agreements',
    icon: Handshake,
    tab: 'agreements',
  },
  {
    title: 'Team Members',
    icon: Users,
    tab: 'members',
  },
];

export const LATEST_HEALTH_CHECK_STORAGE_KEY = 'LATEST_HEALTH_CHECK';