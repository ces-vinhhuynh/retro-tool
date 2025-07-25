import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'LATEST_HEALTH_CHECK';
const EXPIRATION_HOURS = 1;

export interface LatestHealthCheckData {
  healthCheckId: string;
  teamId: string;
  userId: string;
  timestamp: string;
  expiresAt: string;
}

interface HealthCheckStore {
  data: LatestHealthCheckData | null;
  saveLatestHealthCheck: (
    healthCheckId: string,
    teamId: string,
    userId: string,
  ) => void;
  removeLatestHealthCheck: () => void;
  getLatestHealthCheck: () => LatestHealthCheckData | null;
}

const useHealthCheckStore = create<HealthCheckStore>()(
  persist(
    (set, get) => ({
      data: null,

      saveLatestHealthCheck: (
        healthCheckId: string,
        teamId: string,
        userId: string,
      ) => {
        try {
          const now = new Date();
          const expiresAt = new Date(
            now.getTime() + EXPIRATION_HOURS * 60 * 60 * 1000,
          );

          const data: LatestHealthCheckData = {
            healthCheckId,
            teamId,
            userId,
            timestamp: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
          };

          set({ data });
        } catch (error) {
          console.error('Failed to save latest health check:', error);
        }
      },

      removeLatestHealthCheck: () => {
        try {
          set({ data: null });
        } catch (error) {
          console.error('Failed to remove latest health check:', error);
        }
      },

      getLatestHealthCheck: () => {
        try {
          const { data } = get();
          if (!data) return null;

          const now = new Date();
          const expiresAt = new Date(data.expiresAt);

          if (now > expiresAt) {
            set({ data: null });
            return null;
          }

          return data;
        } catch (error) {
          console.error('Failed to get latest health check:', error);
          return null;
        }
      },
    }),
    {
      name: STORAGE_KEY,
    },
  ),
);

export const saveLatestHealthCheck = (
  healthCheckId: string,
  teamId: string,
  userId: string,
) => {
  useHealthCheckStore
    .getState()
    .saveLatestHealthCheck(healthCheckId, teamId, userId);
};

export const removeLatestHealthCheck = () => {
  useHealthCheckStore.getState().removeLatestHealthCheck();
};

export const getLatestHealthCheck = (): LatestHealthCheckData | null => {
  return useHealthCheckStore.getState().getLatestHealthCheck();
};

export { useHealthCheckStore };
