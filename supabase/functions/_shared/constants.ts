export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "Email and workspace_id are required",
  ALREADY_MEMBER: "User is already a member of this workspace",
  SENDGRID_API_MISSING: "SendGrid API key not set",
  EMAIL_SEND_FAILED: "Failed to send email:",
  UNEXPECTED_ERROR: "An unexpected error occurred",
} as const;

export const INVITATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
} as const;

export const WORKSPACE_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;
