import * as React from 'react';

const BREAKPOINTS = {
  xs: 640, // <= 640px
  sm: 768, // 640-768px
  md: 1024, // 768-1024px
  lg: Infinity, // >= 1024px
} as const;

// Extended breakpoints example
const EXTENDED_BREAKPOINTS = {
  xs400: 400,
  xs: 640,
  sm: 768,
  md828: 828,
  md: 1024,
  lg1242: 1242,
  lg1444: 1444,
  lg1792: 1792,
  lg: Infinity,
} as const;

const MOBILE_BREAKPOINT = 1024;

// Type for custom breakpoints
export type CustomBreakpoints = Record<string, number>;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

// Generic hook for custom breakpoint checking (less than)
export function useIsBreakpointLessThan(breakpoint: number) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < breakpoint);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return !!isMobile;
}

// Generic hook for custom breakpoint checking (greater than or equal)
export function useIsBreakpointGreaterThan(breakpoint: number) {
  const [isGreater, setIsGreater] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const onChange = () => {
      setIsGreater(window.innerWidth >= breakpoint);
    };
    mql.addEventListener('change', onChange);
    setIsGreater(window.innerWidth >= breakpoint);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return !!isGreater;
}

// Specific breakpoint hooks (less than)
export function useIsXsScreenSize() {
  return useIsBreakpointLessThan(BREAKPOINTS.xs);
}

export function useIsSmScreenSize() {
  return useIsBreakpointLessThan(BREAKPOINTS.sm);
}

export function useIsMdScreenSize() {
  return useIsBreakpointLessThan(BREAKPOINTS.md);
}

export function useIsLgScreenSize() {
  return useIsBreakpointLessThan(BREAKPOINTS.lg);
}

// Hook to get current breakpoint name
export function useCurrentBreakpoint(customBreakpoints?: CustomBreakpoints) {
  const [breakpoint, setBreakpoint] = React.useState<string | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const breakpointsToUse = customBreakpoints || BREAKPOINTS;

    // Sort breakpoints by value (ascending) and filter out Infinity
    const sortedBreakpoints = Object.entries(breakpointsToUse)
      .filter(([_, value]) => value !== Infinity)
      .sort(([, a], [, b]) => a - b);

    // Find the largest breakpoint key for values >= largest finite breakpoint
    const largestBreakpointKey =
      Object.entries(breakpointsToUse).find(
        ([_, value]) => value === Infinity,
      )?.[0] ||
      sortedBreakpoints[sortedBreakpoints.length - 1]?.[0] ||
      'lg';

    const updateBreakpoint = () => {
      const width = window.innerWidth;

      // Find appropriate breakpoint
      let currentBreakpoint = largestBreakpointKey;

      for (const [key, value] of sortedBreakpoints) {
        if (width < value) {
          currentBreakpoint = key;
          break;
        }
      }

      setBreakpoint(currentBreakpoint);
    };

    // Create media query listeners for all finite breakpoints
    const mediaQueries = sortedBreakpoints.map(([_, value]) =>
      window.matchMedia(`(max-width: ${value - 1}px)`),
    );

    // Set initial value
    updateBreakpoint();

    // Add listeners
    mediaQueries.forEach((mql) => {
      mql.addEventListener('change', updateBreakpoint);
    });

    // Cleanup
    return () => {
      mediaQueries.forEach((mql) => {
        mql.removeEventListener('change', updateBreakpoint);
      });
    };
  }, [customBreakpoints]);

  return breakpoint;
}

// Hook to check if screen is between two breakpoints
export function useIsBetweenBreakpoints(minWidth: number, maxWidth: number) {
  const [isBetween, setIsBetween] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(min-width: ${minWidth}px) and (max-width: ${maxWidth - 1}px)`,
    );
    const onChange = () => {
      const width = window.innerWidth;
      setIsBetween(width >= minWidth && width < maxWidth);
    };
    mql.addEventListener('change', onChange);

    // Set initial value
    const width = window.innerWidth;
    setIsBetween(width >= minWidth && width < maxWidth);

    return () => mql.removeEventListener('change', onChange);
  }, [minWidth, maxWidth]);

  return !!isBetween;
}

// Utility functions (non-hooks) for one-time checks
export const getScreenBreakpoint = (
  customBreakpoints?: CustomBreakpoints,
): string => {
  if (typeof window === 'undefined') return 'lg'; // SSR fallback

  const breakpointsToUse = customBreakpoints || BREAKPOINTS;

  const width = window.innerWidth;

  // Sort breakpoints by value (ascending) and filter out Infinity
  const sortedBreakpoints = Object.entries(breakpointsToUse)
    .filter(([_, value]) => value !== Infinity)
    .sort(([, a], [, b]) => a - b);

  // Find the largest breakpoint key for values >= largest finite breakpoint
  const largestBreakpointKey =
    Object.entries(breakpointsToUse).find(
      ([_, value]) => value === Infinity,
    )?.[0] ||
    sortedBreakpoints[sortedBreakpoints.length - 1]?.[0] ||
    'lg';

  // Find appropriate breakpoint
  for (const [key, value] of sortedBreakpoints) {
    if (width < value) {
      return key;
    }
  }

  return largestBreakpointKey;
};

export const isMobileLessThan = (breakpoint: number): boolean => {
  if (typeof window === 'undefined') return false; // SSR fallback
  return window.innerWidth < breakpoint;
};

export const isMobileGreaterThan = (breakpoint: number): boolean => {
  if (typeof window === 'undefined') return false; // SSR fallback
  return window.innerWidth >= breakpoint;
};

export const isXsMobile = (): boolean => isMobileLessThan(BREAKPOINTS.xs);
export const isSmMobile = (): boolean => isMobileLessThan(BREAKPOINTS.sm);
export const isMdMobile = (): boolean => isMobileLessThan(BREAKPOINTS.md);
export const isLgMobile = (): boolean => isMobileLessThan(BREAKPOINTS.lg);

// Export breakpoints for direct usage
export { BREAKPOINTS, EXTENDED_BREAKPOINTS };

// Usage examples:
/*
// Using default breakpoints
const currentBreakpoint = useCurrentBreakpoint(); // returns: "xs" | "sm" | "md" | "lg"

// Using custom breakpoints  
const customBreakpoint = useCurrentBreakpoint({
  xs0: 400,
  xs: 640,
  sm: 768,
  md828: 828,
  md: 1024,
  lg: Infinity,
});

// Using extended breakpoints
const extendedBreakpoint = useCurrentBreakpoint(extendedBreakpoints);

// Direct breakpoint access
const isMobile = useIsBreakpointLessThan(breakpoints.md);
const isDesktop = useIsBreakpointGreaterThan(breakpoints.md);

// Utility function with custom breakpoints
const screenSize = getScreenBreakpoint(extendedBreakpoints);

// Check specific sizes
const isSmallScreen = useIsSmMobile(); // < 768px
const isBetweenTablet = useIsBetweenBreakpoints(breakpoints.sm, breakpoints.md); // 768-1023px
*/
