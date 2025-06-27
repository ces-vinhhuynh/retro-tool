import { v4 as uuidv4 } from 'https://esm.sh/uuid';
import { CONFIG } from './config.ts';
import {
  WorkspaceInvitePayload,
  WorkspaceInvitationData,
  EmailTemplate,
  TeamInvitePayload,
  TeamInvitationData,
  TeamEmailTemplate,
  HealthCheckInvitePayload,
} from './type.ts';
import {
  createSupabaseClient,
  findExistingUser,
  findExistingInvite,
  getWorkspaceName,
  getTeamName,
  findExistingTeamInvite,
} from './database.ts';
import { sendEmail } from './email.ts';
import {
  ERROR_MESSAGES,
  INVITATION_STATUS,
  WORKSPACE_ROLES,
  TEAM_ROLES,
} from './constants.ts';

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
        .from('workspace_users')
        .update(invitationData)
        .eq('id', existingInvite.id)
        .select()
        .single()
    : await supabase
        .from('workspace_users')
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

export async function handleTeamInvitation(payload: TeamInvitePayload) {
  const supabase = createSupabaseClient();
  const { email, team_id, workspace_id, role = TEAM_ROLES.MEMBER } = payload;

  // Verify team belongs to workspace
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('workspace_id')
    .eq('id', team_id)
    .single();

  if (teamError) {
    throw new Error('Team not found');
  }

  if (team.workspace_id !== workspace_id) {
    throw new Error('Team does not belong to the specified workspace');
  }

  // Find existing user and invitations
  const existingUser = await findExistingUser(supabase, email);
  const existingWorkspaceInvite = await findExistingInvite(
    supabase,
    workspace_id,
    email
  );
  const existingTeamInvite = await findExistingTeamInvite(
    supabase,
    team_id,
    email
  );

  // Check if user is already a team member
  if (existingTeamInvite?.status === INVITATION_STATUS.ACCEPTED) {
    throw new Error(ERROR_MESSAGES.ALREADY_TEAM_MEMBER);
  }

  // Generate token
  const token = uuidv4();
  const tokenExpiresAt = new Date(
    Date.now() + CONFIG.TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  // Get workspace and team names for email
  const [workspaceName, teamName] = await Promise.all([
    getWorkspaceName(supabase, workspace_id),
    getTeamName(supabase, team_id),
  ]);

  let teamInvitationData: Omit<TeamInvitationData, 'workspace_id'>;

  let inviteUrl: string;
  let emailContent: string;

  // Scenario 1: User is already a workspace member
  if (existingWorkspaceInvite?.status === INVITATION_STATUS.ACCEPTED) {
    teamInvitationData = {
      team_id,
      token: null, // No token needed as they're already accepted
      status: INVITATION_STATUS.ACCEPTED,
      token_expires_at: null,
      role,
      email,
      updated_at: new Date().toISOString(),
      user_id: existingUser?.id ?? null,
    };

    inviteUrl = `${CONFIG.APP_URL}/teams/${team_id}`;
    emailContent = `You've been invited to join the team <strong>${teamName}</strong> in workspace <strong>${workspaceName}</strong>.<p>Click <a href="${inviteUrl}">here</a> to accept the invitation and join the team.</p>`;
  }

  // Scenario 2: User has pending workspace invite
  else if (existingWorkspaceInvite?.status === INVITATION_STATUS.PENDING) {
    teamInvitationData = {
      team_id,
      token,
      status: INVITATION_STATUS.PENDING,
      token_expires_at: tokenExpiresAt,
      role,
      email,
      updated_at: new Date().toISOString(),
      user_id: existingUser?.id ?? null,
    };
    inviteUrl = `${CONFIG.APP_URL}/invite/team?workspaceToken=${existingWorkspaceInvite.token}&teamToken=${token}`;
    emailContent = `You've been invited to join the team <strong>${teamName}</strong> in workspace <strong>${workspaceName}</strong>.<p>Click <a href="${inviteUrl}">here</a> to accept the invitation and join the team.</p>`;
  }
  // Scenario 3: User has no workspace invitation
  else {
    // Create workspace invitation first
    const workspaceToken = uuidv4();
    const workspaceInvitationData: WorkspaceInvitationData = {
      workspace_id,
      token: workspaceToken,
      status: INVITATION_STATUS.PENDING,
      token_expires_at: tokenExpiresAt,
      role: WORKSPACE_ROLES.MEMBER,
      email,
      updated_at: new Date().toISOString(),
      user_id: existingUser?.id ?? null,
    };

    await supabase
      .from('workspace_users')
      .insert(workspaceInvitationData)
      .select()
      .single();

    // Create team invitation
    teamInvitationData = {
      team_id,
      token,
      status: INVITATION_STATUS.PENDING,
      token_expires_at: tokenExpiresAt,
      role,
      email,
      updated_at: new Date().toISOString(),
      user_id: existingUser?.id ?? null,
    };
    inviteUrl = `${CONFIG.APP_URL}/invite/team?workspaceToken=${workspaceToken}&teamToken=${token}`;
    emailContent = `You've been invited to join the team <strong>${teamName}</strong> in workspace <strong>${workspaceName}</strong>.<p>Click <a href="${inviteUrl}">here</a> to accept the invitation and join the team.</p>`;
  }

  // Update or insert team invitation
  const result = existingTeamInvite
    ? await supabase
        .from('team_users')
        .update(teamInvitationData)
        .eq('id', existingTeamInvite.id)
        .select()
        .single()
    : await supabase
        .from('team_users')
        .insert(teamInvitationData)
        .select()
        .single();

  if (result.error) {
    throw new Error(result.error.message);
  }

  // Send email
  const emailTemplate: TeamEmailTemplate = {
    to: email,
    subject: `${CONFIG.APP_NAME} – Team Invitation: ${teamName}`,
    content: emailContent,
    isExistingUser: !!existingUser,
    workspaceName,
    teamName,
    isWorkspaceMember:
      existingWorkspaceInvite?.status === INVITATION_STATUS.ACCEPTED,
  };

  await sendEmail(emailTemplate);

  return {
    success: true,
    isResend: !!existingTeamInvite,
    isExistingUser: !!existingUser,
    isWorkspaceMember:
      existingWorkspaceInvite?.status === INVITATION_STATUS.ACCEPTED,
    token: teamInvitationData.token,
    inviteUrl,
  };
}

export async function handleHealthCheckInvitation(
  payload: HealthCheckInvitePayload
) {
  const { userIds, healthCheckId } = payload;
  const supabase = createSupabaseClient();

  const { data: users = [] } = await supabase
    .from('users')
    .select('email')
    .in('id', userIds);

  const emails = users?.map(({ email }) => email) || [];

  const inviteUrl = `${CONFIG.APP_URL}/health-checks/${healthCheckId}`;
  const emailContent = `You've been invited to join the health check .<p>Click <a href="${inviteUrl}">here</a> to join the health check.</p>`;

  for (const email of emails) {
    const emailTemplate = {
      to: email,
      subject: `${CONFIG.APP_NAME} – Health check Invitation`,
      content: emailContent,
      isExistingUser: true,
      workspaceName: '',
    };

    await sendEmail(emailTemplate);
  }

  const { data: healthCheck } = await supabase
    .from('health_checks')
    .select('invited_user_ids')
    .eq('id', healthCheckId)
    .single();

  const { invited_user_ids } = healthCheck;

  invited_user_ids.push(...userIds);

  await supabase
    .from('health_checks')
    .update({ invited_user_ids })
    .eq('id', healthCheckId)
    .select()
    .single();

  return {
    success: true,
  };
}
