export enum WORKSPACE_ROLES {
  owner = 'owner',
  admin = 'admin',
  member = 'member',
}

export type WorkspaceRole = keyof typeof WORKSPACE_ROLES;

export enum TEAM_ROLES {
  admin = 'admin',
  member = 'member',
}

export type TeamRole = keyof typeof TEAM_ROLES;
