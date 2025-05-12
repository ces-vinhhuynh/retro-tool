export const paths = {
  home: {
    getHref: () => '/',
  },

  healthChecks: {
    getHref: () => '/health-checks',
    detail: {
      getHref: (id: string) => `/health-checks/${id}`,
    },
  },

  auth: {
    register: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/signin${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },
} as const;
