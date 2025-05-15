import { create } from 'zustand';

interface WelcomeModalState {
  isOpen: boolean;
  healthCheckId: string | null;
  open: (healthCheckId: string) => void;
  close: () => void;
  hasSeenModal: (healthCheckId: string) => boolean;
  markAsSeen: (healthCheckId: string) => void;
}

export const useWelcomeModalStore = create<WelcomeModalState>((set) => ({
  isOpen: false,
  healthCheckId: null,
  open: (healthCheckId: string) => set({ isOpen: true, healthCheckId }),
  close: () => set({ isOpen: false, healthCheckId: null }),
  hasSeenModal: (healthCheckId: string) => {
    const modalShownKey = `welcome-modal-shown-${healthCheckId}`;
    return localStorage.getItem(modalShownKey) === 'true';
  },
  markAsSeen: (healthCheckId: string) => {
    const modalShownKey = `welcome-modal-shown-${healthCheckId}`;
    localStorage.setItem(modalShownKey, 'true');
  },
}));
