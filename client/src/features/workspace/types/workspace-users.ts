import { Tables } from '@/types/database';

import { Workspace } from './workspace';

export type WorkspaceUser = Tables<'workspace_users'>;
export type WorkspaceUserWithWorkspace = WorkspaceUser & {
  workspace: Workspace;
};
