import { z } from 'zod';

import { teamSchema } from './team.schema';
import { workspaceSchema } from './workspace.schema';

export const workspaceTeamSchema = z.object({
  workspace: workspaceSchema,
  team: teamSchema,
});

export type WorkspaceTeamFormValues = z.infer<typeof workspaceTeamSchema>;
