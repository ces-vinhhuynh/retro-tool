import * as React from 'react';

const BREAKPOINTS = {
  XS: 640, // <= 640px
  SM: 768, // 640-768px
  MD: 1024, // 768-1024px
  LG: Infinity, // >= 1024px
} as const;

const MOBILE_BREAKPOINT = 1024;

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

// Generic hook for custom breakpoint checking
export function useIsMobileLessThan(breakpoint: number) {
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

// Specific breakpoint hooks
export function useIsXsMobile() {
  return useIsMobileLessThan(BREAKPOINTS.XS);
}

export function useIsSmMobile() {
  return useIsMobileLessThan(BREAKPOINTS.SM);
}

export function useIsMdMobile() {
  return useIsMobileLessThan(BREAKPOINTS.MD);
}

export function useIsLgMobile() {
  return useIsMobileLessThan(BREAKPOINTS.LG);
}

// Hook to get current breakpoint name
export function useCurrentBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<string | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < BREAKPOINTS.XS) {
        setBreakpoint('xs');
      } else if (width < BREAKPOINTS.SM) {
        setBreakpoint('sm');
      } else if (width < BREAKPOINTS.MD) {
        setBreakpoint('md');
      } else {
        setBreakpoint('lg');
      }
    };

    // Create media query listeners for all breakpoints
    const mediaQueries = [
      window.matchMedia(`(max-width: ${BREAKPOINTS.XS - 1}px)`),
      window.matchMedia(`(max-width: ${BREAKPOINTS.SM - 1}px)`),
      window.matchMedia(`(max-width: ${BREAKPOINTS.MD - 1}px)`),
    ];

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
  }, []);

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
export const getScreenBreakpoint = (): string => {
  if (typeof window === 'undefined') return 'lg'; // SSR fallback

  const width = window.innerWidth;

  if (width < BREAKPOINTS.XS) return 'xs';
  if (width < BREAKPOINTS.SM) return 'sm';
  if (width < BREAKPOINTS.MD) return 'md';
  return 'lg';
};

export const isMobileLessThan = (breakpoint: number): boolean => {
  if (typeof window === 'undefined') return false; // SSR fallback
  return window.innerWidth < breakpoint;
};

export const isXsMobile = (): boolean => isMobileLessThan(BREAKPOINTS.XS);
export const isSmMobile = (): boolean => isMobileLessThan(BREAKPOINTS.SM);
export const isMdMobile = (): boolean => isMobileLessThan(BREAKPOINTS.MD);
export const isLgMobile = (): boolean => isMobileLessThan(BREAKPOINTS.LG);

// Export breakpoints for direct usage
export { BREAKPOINTS };
