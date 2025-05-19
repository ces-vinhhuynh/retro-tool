import { create } from 'zustand';

interface NewSessionModalState {
  templateId: string;
  setTemplateId: (templateId: string) => void;
}

export const useNewSessionModalStore = create<NewSessionModalState>((set) => ({
  templateId: '',
  setTemplateId: (templateId: string) => set({ templateId }),
}));
