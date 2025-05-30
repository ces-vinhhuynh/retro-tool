import { v4 as uuidv4 } from "https://esm.sh/uuid";
import { CONFIG } from "./config.ts";
import {
  WorkspaceInvitePayload,
  WorkspaceInvitationData,
  EmailTemplate,
} from "./type.ts";
import {
  createSupabaseClient,
  findExistingUser,
  findExistingInvite,
  getWorkspaceName,
} from "./database.ts";
import { sendEmail } from "./email.ts";
import {
  ERROR_MESSAGES,
  INVITATION_STATUS,
  WORKSPACE_ROLES,
} from "./constants.ts";

export async function handleWorkspaceInvitation(
  payload: WorkspaceInvitePayload
) {
  const supabase = createSupabaseClient();
  const { email, workspace_id, role = WORKSPACE_ROLES.MEMBER } = payload;

  // Find existing user and invitation
  const existingUser = await findExistingUser(supabase, email);
  const existingInvite = await findExistingInvite(
    supabase,
    workspace_id,
    email
  );

  if (existingInvite?.status === INVITATION_STATUS.ACCEPTED) {
    throw new Error(ERROR_MESSAGES.ALREADY_MEMBER);
  }

  // Generate token
  const token = uuidv4();
  const tokenExpiresAt = new Date(
    Date.now() + CONFIG.TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  // Create invitation data
  const invitationData: WorkspaceInvitationData = {
    workspace_id,
    token,
    status: INVITATION_STATUS.PENDING,
    token_expires_at: tokenExpiresAt,
    role,
    email,
    updated_at: new Date().toISOString(),
    user_id: existingUser?.id ?? null,
  };

  // Update or insert invitation
  const result = existingInvite
    ? await supabase
        .from("workspace_users")
        .update(invitationData)
        .eq("id", existingInvite.id)
        .select()
        .single()
    : await supabase
        .from("workspace_users")
        .insert(invitationData)
        .select()
        .single();

  if (result.error) {
    throw new Error(result.error.message);
  }

  // Get workspace name for email
  const workspaceName = await getWorkspaceName(supabase, workspace_id);
  const inviteUrl = `${CONFIG.APP_URL}/invite/workspace?token=${token}`;

  // Prepare and send email
  const emailTemplate: EmailTemplate = {
    to: email,
    subject: `${CONFIG.APP_NAME} – You've been invited to join "${workspaceName}"`,
    content: `You've been invited to join the workspace <strong>${workspaceName}</strong>.<p>Click <a href="${inviteUrl}">here</a> to accept the invitation.</p>`,
    isExistingUser: !!existingUser,
    workspaceName,
  };

  await sendEmail(emailTemplate);

  return {
    success: true,
    isResend: !!existingInvite,
    isExistingUser: !!existingUser,
    token,
  };
}
