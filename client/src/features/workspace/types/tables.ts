import { TEAM_ROLES, TeamRole } from '../constants/user';

export type TeamTable = {
  id: string;
  name: string;
  users: {
    id: string;
    full_name: string;
    avatar_url: string;
    role: (typeof TEAM_ROLES)[keyof typeof TEAM_ROLES];
  }[];
};

export type WorkspaceUserTable = {
  id: string;
  avatar_url: string;
  full_name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  teams: string[];
};

export type TeamMemberTable = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  role: TeamRole;
};
