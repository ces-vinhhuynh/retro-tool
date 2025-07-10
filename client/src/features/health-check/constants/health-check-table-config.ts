// Define the responsive config type
export type HealthCheckTableResponsiveConfig = {
  [key: string]: {
    columnsToShow: number;
    questionColumnWidthClass: string;
    questionRowHeight: string;
    healthCheckColumnWidth: string;
    titleWidth: string;
    headerHeight: string;
  };
};

// Responsive configuration for different screen sizes on data track page
export const DATA_TRACK_HEALTH_CHECK_TABLE: HealthCheckTableResponsiveConfig = {
  xs400: {
    // < 400px
    columnsToShow: 1,
    questionColumnWidthClass: 'w-30',
    questionRowHeight: 'h-12',
    healthCheckColumnWidth: 'min-w-48 max-w-48',
    titleWidth: 'min-w-10 max-w-15',
    headerHeight: 'h-26',
  },
  xs: {
    // 400-640px
    columnsToShow: 2,
    questionColumnWidthClass: 'w-30',
    questionRowHeight: 'h-14',
    healthCheckColumnWidth: 'min-w-48 max-w-48',
    titleWidth: 'min-w-10 max-w-15',
    headerHeight: 'h-26',
  },
  sm: {
    // 640-768px
    columnsToShow: 3,
    questionColumnWidthClass: 'w-32',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-22 max-w-28',
    titleWidth: 'min-w-10 max-w-15',
    headerHeight: 'h-26',
  },
  md828: {
    // 768-828px
    columnsToShow: 4,
    questionColumnWidthClass: 'w-30',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-20 max-w-30',
    titleWidth: 'min-w-10 max-w-15',
    headerHeight: 'h-26',
  },
  md: {
    // 828-1024px
    columnsToShow: 5,
    questionColumnWidthClass: 'w-48',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-20 max-w-38',
    titleWidth: 'min-w-10 max-w-15',
    headerHeight: 'h-26',
  },
  lg1242: {
    // 1024-1242px
    columnsToShow: 3,
    questionColumnWidthClass: 'w-46',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-26 max-w-30',
    titleWidth: 'min-w-26 max-w-28',
    headerHeight: 'h-26',
  },
  lg1444: {
    // 1242-1444px
    columnsToShow: 4,
    questionColumnWidthClass: 'w-48',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-20 max-w-36',
    titleWidth: 'min-w-30 max-w-32',
    headerHeight: 'h-28',
  },
  lg1792: {
    // 1444-1792px
    columnsToShow: 6,
    questionColumnWidthClass: 'w-48',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-30 max-w-38',
    titleWidth: 'min-w-26 max-w-28',
    headerHeight: 'h-28',
  },
  lg: {
    // >= 1792px
    columnsToShow: 8,
    questionColumnWidthClass: 'w-72',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-30 max-w-48',
    titleWidth: 'min-w-24 max-w-28',
    headerHeight: 'h-28',
  },
} as const;

// Responsive configuration for different screen sizes on health check page
export const SCRUM_TEAM_HEALTH_CHECK_TABLE: HealthCheckTableResponsiveConfig = {
  xs400: {
    // < 400px
    columnsToShow: 1,
    questionColumnWidthClass: 'w-20',
    questionRowHeight: 'h-12',
    healthCheckColumnWidth: 'min-w-48 max-w-48',
    titleWidth: 'min-w-10 max-w-15',
    headerHeight: 'h-26',
  },
  xs: {
    // 400-640px
    columnsToShow: 2,
    questionColumnWidthClass: 'w-30',
    questionRowHeight: 'h-14',
    healthCheckColumnWidth: 'min-w-48 max-w-48',
    titleWidth: 'min-w-10 max-w-15',
    headerHeight: 'h-26',
  },
  sm: {
    // 640-768px
    columnsToShow: 3,
    questionColumnWidthClass: 'w-32',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-22 max-w-28',
    titleWidth: 'min-w-10 max-w-15',
    headerHeight: 'h-26',
  },
  md828: {
    // 768-828px
    columnsToShow: 4,
    questionColumnWidthClass: 'w-36',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-40 max-w-40',
    titleWidth: 'min-w-38 max-w-38',
    headerHeight: 'h-26',
  },
  md: {
    // 828-1024px
    columnsToShow: 5,
    questionColumnWidthClass: 'w-48',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-36 max-w-36',
    titleWidth: 'min-w-34 max-w-34',
    headerHeight: 'h-26',
  },
  lg1242: {
    // 1024-1242px
    columnsToShow: 3,
    questionColumnWidthClass: 'w-46',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-26 max-w-30',
    titleWidth: 'min-w-28 max-w-28',
    headerHeight: 'h-26',
  },
  lg1444: {
    // 1242-1444px
    columnsToShow: 5,
    questionColumnWidthClass: 'w-48',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-20 max-w-36',
    titleWidth: 'min-w-32 max-w-32',
    headerHeight: 'h-28',
  },
  lg1792: {
    // 1444-1792px
    columnsToShow: 5,
    questionColumnWidthClass: 'w-48',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-30 max-w-38',
    titleWidth: 'min-w-40 max-w-40',
    headerHeight: 'h-28',
  },
  lg: {
    // >= 1792px
    columnsToShow: 5,
    questionColumnWidthClass: 'w-48',
    questionRowHeight: 'h-16',
    healthCheckColumnWidth: 'min-w-48 max-w-48',
    titleWidth: 'min-w-40 max-w-40',
    headerHeight: 'h-28',
  },
} as const;
