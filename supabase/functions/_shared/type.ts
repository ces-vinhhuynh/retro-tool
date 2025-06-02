import { INVITATION_STATUS } from "./constants.ts";

export interface WorkspaceInvitePayload {
  email: string;
  workspace_id: string;
  role?: string;
}

export interface WorkspaceInvitationData {
  workspace_id: string;
  token: string;
  status:
    | INVITATION_STATUS.PENDING
    | INVITATION_STATUS.ACCEPTED
    | INVITATION_STATUS.EXPIRED;
  token_expires_at: string;
  role: string;
  email: string;
  updated_at: string;
  user_id: string | null;
}

export interface EmailTemplate {
  to: string;
  subject: string;
  content: string;
  isExistingUser: boolean;
  workspaceName: string;
}

export interface TeamInvitePayload {
  email: string;
  team_id: string;
  workspace_id: string;
  role?: string;
}

export interface TeamInvitationData {
  team_id: string;
  workspace_id: string;
  token: string;
  status:
    | INVITATION_STATUS.PENDING
    | INVITATION_STATUS.ACCEPTED
    | INVITATION_STATUS.EXPIRED;
  token_expires_at: string;
  role: string;
  email: string;
  updated_at: string;
  user_id: string | null;
}

export interface TeamEmailTemplate extends EmailTemplate {
  teamName: string;
  isWorkspaceMember: boolean;
}
