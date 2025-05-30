import { CONFIG } from "./config.ts";
import { EmailTemplate } from "./type.ts";
import { ERROR_MESSAGES } from "./constants.ts";
export async function sendEmail(template: EmailTemplate) {
  if (!CONFIG.SENDGRID_API_KEY) {
    throw new Error(ERROR_MESSAGES.SENDGRID_API_MISSING);
  }

  const emailContent = `
  <p>Welcome to ${CONFIG.APP_NAME}!</p>
  <p>${template.content}</p>
  <p>This invitation link will expire in ${CONFIG.TOKEN_EXPIRY_DAYS} days.</p>
`;

  const emailPayload = {
    personalizations: [
      {
        to: [{ email: template.to }],
        subject: template.subject,
      },
    ],
    from: { email: CONFIG.FROM_EMAIL },
    content: [{ type: "text/html", value: emailContent }],
  };

  const response = await fetch(CONFIG.SENDGRID_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CONFIG.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${ERROR_MESSAGES.EMAIL_SEND_FAILED} ${errorText}`);
  }
}
