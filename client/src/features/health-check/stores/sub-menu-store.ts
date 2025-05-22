import { create } from 'zustand';

interface SubMenuStore {
  selectedSubmenu: string;
  setSelectedSubmenu: (submenu: string) => void;
}

export const useSubMenuStore = create<SubMenuStore>((set) => ({
  selectedSubmenu: '',
  setSelectedSubmenu: (submenu) => set({ selectedSubmenu: submenu }),
}));
