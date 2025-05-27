import { Tables, TablesInsert, TablesUpdate } from '@/types/database';

import { Workspace } from './workspace';

export type WorkspaceUser = Tables<'workspace_users'>;
export type WorkspaceUserInsert = TablesInsert<'workspace_users'>;
export type WorkspaceUserWithWorkspace = WorkspaceUser & {
  workspace: Workspace;
};

export type WorkspaceUserUpdate = TablesUpdate<'workspace_users'>;