export const WORKSPACE_ROLES = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
};

export enum TEAM_ROLES {
  admin = 'admin',
  member = 'member',
}

export type TeamRole = keyof typeof TEAM_ROLES;
