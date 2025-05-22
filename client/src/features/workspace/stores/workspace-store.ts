import { create } from 'zustand';

import { WorkspaceUserWithWorkspace } from '@/features/workspace/types/workspace-users';
import { Team } from '@/types/team';

interface WorkspaceState {
  currentWorkspace: WorkspaceUserWithWorkspace | null;
  currentTeam: Team | null;
  setCurrentWorkspace: (workspace: WorkspaceUserWithWorkspace | null) => void;
  setCurrentTeam: (team: Team | null) => void;
  reset: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: null,
  currentTeam: null,
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setCurrentTeam: (team) => set({ currentTeam: team }),
  reset: () => set({ currentWorkspace: null, currentTeam: null }),
}));
