import { create } from 'zustand';

import { Agreement } from '../types/agreements';
import {
  ActionItemWithAssignees,
  HealthCheck,
  User,
} from '../types/health-check';
import { Issue } from '../types/issues';

interface SubMenuStore {
  selectedSubmenu: string;
  setSelectedSubmenu: (submenu: string) => void;
  agreements: Agreement[];
  setAgreements: (agreements: Agreement[]) => void;
  issues: Issue[];
  setIssues: (issues: Issue[]) => void;
  actionItems: ActionItemWithAssignees[];
  setActionItems: (actionItems: ActionItemWithAssignees[]) => void;
  healthCheckId: string;
  setHealthCheckId: (id: string) => void;
  healthCheck: HealthCheck;
  setHealthCheck: (healthCheck: HealthCheck) => void;
  teamMembers: User[];
  setTeamMembers: (members: User[]) => void;
  isFacilitator: boolean;
  setIsFacilitator: (isFacilitator: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const useSubMenuStore = create<SubMenuStore>((set) => ({
  selectedSubmenu: '',
  setSelectedSubmenu: (submenu) => set({ selectedSubmenu: submenu }),
  agreements: [],
  setAgreements: (agreements) => set({ agreements }),
  issues: [],
  setIssues: (issues) => set({ issues }),
  actionItems: [],
  setActionItems: (actionItems) => set({ actionItems }),
  healthCheckId: '',
  setHealthCheckId: (id) => set({ healthCheckId: id }),
  healthCheck: {} as HealthCheck,
  setHealthCheck: (healthCheck) => set({ healthCheck }),
  teamMembers: [],
  setTeamMembers: (members) => set({ teamMembers: members }),
  isFacilitator: false,
  setIsFacilitator: (isFacilitator) => set({ isFacilitator }),
  isAdmin: false,
  setIsAdmin: (isAdmin) => set({ isAdmin }),
}));
